import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  Card,
  Container,
  CardContent,
  Box,
  Grid,
  Item,
  Chip,
  Typography,
  NativeSelect,
  MenuItem,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Paper,
  FormControl,
  Button,
  Select,
} from "@mui/material";
import Validator from "service/core/validator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faFilter,
  faFilterCircleDollar,
  faDownload,
  faGear,
  faCalendar,
  faXmark,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";

let defaultPageSize = 10;

const Pagination = (props) => {

  const [pageNo, setPageNo] = useState(0);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [allMerchantsList, setAllMerchantsList] = useState([]);
  const [pageSize, setPageSize] = useState(allMerchantsList.length > defaultPageSize ? defaultPageSize : allMerchantsList.length);
  const [selectedMerchantList, setSelectedMerchantList] = useState([]);
  const [pageNoForRedirect, setPageNoForRedirect] = useState(0);
  const [reRender, setReRender] = useState(1);

  const pageSizes = [5, 10, props.rowsWithId.length];

  useEffect(() => {
    setPageSize(props.filterApplied ? props.rowsWithId.length : props.rowsWithId.length > defaultPageSize ? defaultPageSize : props.rowsWithId.length);
    createAnArrayAccordingToPageSize(
      props.rowsWithId, 
      props.filterApplied ? props.rowsWithId.length : props.rowsWithId.length > defaultPageSize ? defaultPageSize : props.rowsWithId.length, 
      props.filterApplied ? 0 : pageNo
    );
  }, [props.rowsWithId.toString()]);

  const createAnArrayAccordingToPageSize = (allMerchantList, pSize, pNo) => {
    let actualArray = allMerchantList.slice(pNo * pSize, pNo * pSize + pSize);
    props.setSelectedRowsWithId(actualArray);

    let tCount = pSize != 0 ? allMerchantList.length / pSize : 0;
    setTotalPageCount(tCount);
  }

  useEffect(() => {
    setReRender(reRender + 1);
  }, [pageNo])

  const handlePageChange = (e) => {
    setPageNo(e.selected);
    createAnArrayAccordingToPageSize(props.rowsWithId, pageSize, e.selected);
  }

  const pageStart = () => {
    return pageNo == 0 ? 1 : (pageNo * pageSize) + 1;
  }

  const pageEnd = () => {
    var end = (pageStart() - 1) + pageSize;
    return end > props.rowsWithId.length ? props.rowsWithId.length : end;
  }

  return (
    <>
      {/* Pagination */}
      <div
        id="PaginationWithDetails"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "16px",
        }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xl={6}
            lg={6}
            md={6}
            sm={6}
            xs={6}
            alignContent="center"
            alignItems="center"
          >
            <Typography
              variant="body1"
              fontSize={16}
              fontWeight={500}
              style={{ color: "var(--accent-color)", width: "100%" }}
            >
              Showing {pageStart()} to {pageEnd()} of {props.rowsWithId.length} rows
            </Typography>
          </Grid>
        </Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "var(--light-color)",
              height: "auto",
              padding: "8px 16px",
              borderRadius: "7px",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center" }}
            >
              {reRender && <>
                <ReactPaginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  breakLabel={"..."}
                  pageCount={totalPageCount}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={2}
                  onPageChange={handlePageChange}
                  containerClassName={
                    "pagination justify-content-end my-auto"
                  }
                  pageClassName={
                    "page-item bg-transparent border-0"
                  }
                  pageLinkClassName={
                    "page-link rounded-lg mx-1 bg-transparent border-0"
                  }
                  previousClassName={
                    "page-item bg-transparent border-0"
                  }
                  previousLinkClassName={
                    "page-link rounded-lg mr-2 bg-transparent border-0"
                  }
                  nextClassName={
                    "page-item bg-transparent border-0"
                  }
                  nextLinkClassName={
                    "page-link rounded-lg ml-2 bg-transparent border-0"
                  }
                  breakClassName={
                    "page-item rounded-lg mx-1 bg-transparent border-0"
                  }
                  breakLinkClassName={
                    "page-link rounded-lg bg-transparent border-0"
                  }
                  activeClassName={
                    "active bg-primary rounded-lg"
                  }
                  forcePage={0}
                />
              </>}
            </div>
            <FormControl>
              <div
                style={{
                  display: "flex",
                  minWidth: "180px",
                  alignItems: "center",
                  marginLeft: "32px",
                }}
              >
                <Typography
                  gap={2}
                  variant="body1"
                  fontSize={17}
                  fontWeight={500}
                  style={{ display: "inline" }}
                >
                  <span
                    style={{
                      fontSize: "var(--font-x-small)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--accent-color)",
                      marginRight: "5px",
                    }}
                  >
                    Rows Per Page
                  </span>
                </Typography>
                {/* <Select
                                  size="small"
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={this.state.pageSize}
                                  onChange={this.handleRowsPerPage}
                                  sx={{ width: 72 }}
                                >
                                  <MenuItem
                                    value={10}
                                    style={{ color: "var(--accent-color)" }}
                                  >
                                    <span style={{ color: "var(--accent-color)" }}>10</span>
                                  </MenuItem>
                                  <MenuItem
                                    value={15}
                                    style={{ color: "var(--accent-color)" }}
                                  >
                                    <span style={{ color: "var(--accent-color)" }}>15</span>
                                  </MenuItem>
                                  <MenuItem
                                    value={20}
                                    style={{ color: "var(--accent-color)" }}
                                  >
                                    <span style={{ color: "var(--accent-color)" }}>20</span>
                                  </MenuItem>
                                </Select> */}
                <select
                  className="form-control ccy-input w-33 avoidToggle"
                  id="pageSizeDropDown"
                  onChange={(e) => { setPageSize(e.target.value); createAnArrayAccordingToPageSize(props.rowsWithId, e.target.value, 0); }}
                >
                  {pageSizes.map((v) => {
                    return (<option
                      selected={ v == pageSize ? true : false }
                      key={v}
                      value={v}
                      className="w-100 avoidToggle"
                    >
                      {v > 10 ? "ALL" : v}
                    </option>)
                  })}
                </select>
              </div>
            </FormControl>
          </div>
        </div>
      </div>
    </>
  )
};

export default Pagination;