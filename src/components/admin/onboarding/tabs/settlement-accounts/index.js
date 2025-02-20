import * as React from 'react';

//Components
import { Divider, IconButton } from '@material-ui/core';
import AppRadioButton from 'components/$widgets/form-inputs/AppRadioButton';
import Utils from 'service/core/utils';

//Html file
import { html } from 'components/admin/onboarding/tabs/settlement-accounts/index.html';

//MUI Icons
import { Delete, Edit } from '@material-ui/icons';

//Service
import { Auth } from 'aws-amplify';
import { StorageService } from 'service/core/storage.service';
import { StorageKeys } from 'service/core/storage.service';
import { DashboardService } from 'service/api/dashboard.service';

class Settlement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: this.prepareColumns(),
            rows: [],
            openSettlementForm: false,
            loading: false,
            merchantId: props.merchantId,
            selectedRowValue: {},
            flagForUpdateSettlement: false,
            flagForDeleteSettlement: false,
            countryList: [],
            listingLoader: false,
        }
    }

    /**
     * Prepareing settlment listing table columns
     * @returns cols
     */
    prepareColumns = () => {
        const cols = [
            {
                field: "primaryAccount",
                headerName: "Primary",
                width: 50,
                minWidth: 50,
                headerClassName: "tableHeaderStyle",
                flex: 1,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => (
                    params.value === 1 ?
                        <AppRadioButton label="" disabled={true} value={true} />
                        :
                        <AppRadioButton label="" disabled={true} value={false} />
                ),
            },
            {
                field: "country",
                headerName: "Country",
                headerClassName: "tableHeaderStyle",
                width: 80,
                minWidth: 80,
                flex: 1,
                renderCell: (params) => {
                    return this.findCountryDescription(params.value)
                },
            },
            {
                field: "settlementCurrency",
                headerName: "A/C ccy",
                width: 100,
                headerClassName: "tableHeaderStyle",
                minWidth: 100,
                flex: 1,
            },
            {
                field: "branchCode",
                headerName: "Branch Code",
                width: 120,
                headerClassName: "tableHeaderStyle",
                minWidth: 120,
                flex: 1,
            },
            {
                field: "bankAccountNo",
                headerName: "A/c Number",
                width: 130,
                headerClassName: "tableHeaderStyle",
                minWidth: 130,
                flex: 1,
            },
            {
                field: "bankName",
                headerName: "Bank Name",
                width: 150,
                headerClassName: "tableHeaderStyle",
                minWidth: 150,
                flex: 1,
            },
            {
                field: "activeStatus",
                headerName: "Status",
                width: 80,
                headerClassName: "tableHeaderStyle",
                minWidth: 100,
                flex: 1,
                renderCell: (params) => (
                    params.value === 1 ? "Active" : "InActive"
                ),
            },
            {
                field: "bankBranch",
                headerName: "Branch Name And Address",
                width: 400,
                headerClassName: "tableHeaderStyle",
                minWidth: 250,
                flex: 1,
                cellClassName: 'nowrap-cell',
                renderCell: (params) => (
                    Utils.concatenateAddressFields([
                        params.row.bankBranch,
                        params.row.address1,
                        params.row.address2,
                        params.row.city,
                        params.row.state,
                        params.row.postCode
                    ])
                )
            },
            {
                field: "action",
                headerName: "Action",
                width: 400,
                headerClassName: "tableHeaderStyle",
                minWidth: 250,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => {
                    return (
                        <>
                            <IconButton aria-label="Edit" title='Edit'
                                onClick={() => {
                                    this.setState({
                                        selectedRowValue: params.row,
                                        flagForUpdateSettlement: true,
                                    });
                                }}
                            >
                                <Edit
                                    style={{ color: 'var(--primary-color)' }}
                                />
                            </IconButton>

                            <Divider orientation="vertical" style={{ height: '50%', margin: '7%' }} />

                            <IconButton aria-label="delete" title='Delete'
                                onClick={(e) => {
                                    this.setState({
                                        selectedRowValue: params.row,
                                        flagForDeleteSettlement: true,
                                    });
                                }}
                            >
                                <Delete
                                    style={{ color: 'red' }}
                                />
                            </IconButton>
                        </>
                    )
                }
            },
        ]

        return cols;
    }

    componentDidMount = async () => {
        try {
            await Auth.currentSession().then(res => {
                let jwt = res["idToken"]["jwtToken"];
                StorageService.set(StorageKeys.clientJwt, jwt);
            });

            this.fetchSettlementAcList();
            this.fetchCountryList();
        } catch (error) {
            console.error(error);
        }
    }

    componentDidUpdate = (prevProps) => {
        try {
            if (prevProps.merchantId !== this.props.merchantId) {
                this.setState({ merchantId: this.props.merchantId });
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Method for open a settlement form popup
     */
    openForm = () => {
        this.setState({ openSettlementForm: true });
    }

    /**
     * Method for close a settlement form popup
     * And call the settlement fetch method
     */
    closeForm = () => {
        this.setState({ openSettlementForm: false });
        this.fetchSettlementAcList();
    }

    /**
     * Handle the flag state variables
     */
    updateFlags = (v) => {
        try {
            switch (v) {
                case "save":
                    this.setState({ flagForUpdateSettlement: false });
                    break;

                case "delete":
                    this.setState({ flagForDeleteSettlement: false });
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
    * Fetch country in lookup details
    */
    fetchCountryList = async () => {
        try {
            this.setState({ loading: true });
            const result = await DashboardService.getLookupDetails("country");

            if (result && result.lookupDetails && result.lookupDetails.length > 0) {
                this.setState({ countryList: result.lookupDetails, loading: false });
            } else {
                this.setState({ loading: false });
            }
        } catch (error) {
            console.error(error);
        }
    }

    //Fetch merchant settlement account list
    fetchSettlementAcList = async () => {
        try {
            this.setState({listingLoader :true});
            const response = await DashboardService.getMerchantSettlement(this.state.merchantId);

            console.log("response", response);
            if (response !== undefined && response != null && response.merchantSettlements != null && response.merchantSettlements.length > 0) {
                this.setState({ rows: response.merchantSettlements ,listingLoader:false});
            }else{
                this.setState({listingLoader:false});
            }
        } catch (error) {
            console.error(error);
        }
    }

    /*
     * Find the description using the param countryCode
     * If the description is empty, return the given countryCode
     */
    findCountryDescription = (countryCode) => {
        let description = countryCode;

        try {
            for (const item of this.state.countryList) {
                if (item.lookupCode === countryCode) {
                    description = item.description;
                    break;
                }
            }
        } catch (error) {
            console.error(error);
        }

        return description;
    }

    render = () => html.apply(this);
}

export default Settlement;