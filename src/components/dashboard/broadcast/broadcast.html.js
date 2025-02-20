import { Backdrop, Box, Card, CardContent, Fade, Grid, IconButton, Modal, Typography } from "@mui/material";
import { withStyles } from "@material-ui/styles";
import CloseIcon from '@mui/icons-material/Close';
import "./broadcast.scss";

export function html() {
    const {
        Heading, loading, broadcastMessages
    } = this.state;

    const CapGrid = withStyles((theme) => ({
        root: ({ expanded, messageId }) => ({
            "&, &:before": {
                content: "",
                width: 0,
                height: 0,
                borderTop: expanded[messageId] ? "1.3rem solid transparent" : "1.85rem solid transparent",
                borderBottom: expanded[messageId] ? "0rem solid transparent" : "1.9rem solid transparent",
                borderRight: expanded[messageId] ? "0rem solid white" : "1.9rem solid white"
            }
        }),
        '@media screen and (max-width: 1199px)': {
            root: {
                content: "",
                width: 0,
                height: 0,
                borderTop: "1.3rem solid transparent",
                borderBottom: "0rem solid transparent",
                borderRight: "0rem solid white"
            }
        },
    }))(Grid);

    const ShowNotificationTag = (props) => {
        return (
            <Grid item xs={12} className={`notification ${props.item.messageId} ${props.className}`}>
                <Grid container onClick={() => this.toggleAccordion(props.item.messageId)}>
                    <CapGrid expanded={this.state.expanded} messageId={props.item.messageId} item xl={props.expanded ? 11 : 3} lg={props.expanded ? 11 : 3} md={11} sm={11} xs={11}
                        sx={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row', lg: 'row' },
                            transition: 'width 1s ease-in-out'
                        }}>
                        <Typography className={"message-sub"} padding={1} variant="body1" fontWeight={500} sx={{ textAlign: 'center' }}>
                            {props.item.messageSubject}
                        </Typography>
                    </CapGrid>

                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1} paddingRight={props.expanded ? "6px" : "0px"} className={props.expanded ? "messageCloseIcon-accordion" : "messageCloseIcon2"}>
                        <IconButton onClick={props.closeBroadcast}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>

                    <Grid
                        item
                        xl={props.expanded ? 12 : 8.5}
                        lg={props.expanded ? 12 : 8.5}
                        md={12}
                        xs={12}
                        sm={12}
                        sx={{
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            overflow: 'auto',
                            position: 'relative',
                            zIndex: 2
                        }}
                    >
                        <Typography padding={1} variant="body2" color="initial" className={props.expanded ? "messageBody-accordion" : "messageBody"} noWrap={false}>
                            {props.expanded ? props.item.messageBody : screen.width < 1199 ? props.item.messageBody : this.handleBroadcastWidth(props.item.messageBody)}
                        </Typography>
                    </Grid>
                    {!props.expanded && (
                        <Grid item xl={0.5} lg={0.5} md={0} sm={0} xs={0} sx={{ background: 'white', display: "flex", justifyContent: "flex-end", alignItems: "center", paddingRight: 1 }}>
                            <IconButton onClick={props.closeBroadcast} className="messageCloseIcon1">
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        );
    }

    return (
        <>
            {!broadcastMessages.length == 0 && (
                <Card>
                    <CardContent sx={{ maxHeight: '250px', overflow: 'auto' }}>
                            {loading && <div id="semiTransparenDiv"></div>}

                            {
                                broadcastMessages.map((item, index) => {
                                    return (
                                        <Box className="messages" key={index} mt={index > 0 ? 2 : 0}>
                                            <Grid container spacing={0} >
                                                <ShowNotificationTag className={this.state.expanded[item.messageId] ? `messageSubjectColor-accordion-${item.severity}` : `messageSubjectColor-${item.severity}`} item={item}
                                                    closeBroadcast={(e) => this.handleBroadcastClose(e,item.messageId)}
                                                    expanded={this.state.expanded[item.messageId]} />
                                            </Grid>
                                        </Box>
                                    );
                                })
                            }
                    </CardContent>
                </Card>
            )}

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={this.state.modalOpen}
                onClose={this.handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={this.state.modalOpen}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '90vw',
                        width: '500px',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 2
                    }}>
                        <Grid container mb='5px' textAlign="center" alignItems="center" justifyContent="center">
                            <Grid item xs={10}>
                                <Typography className={`modal-${this.state.messageSeverity}`} variant="h6" component="h2">
                                    {this.state.messageSubject}
                                </Typography>
                            </Grid>
                            <Grid item xs={2} textAlign="right">
                                <IconButton onClick={() => { this.handleBroadcastClose(this.state.messageId); }}>
                                    <CloseIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            {this.state.messageContent}
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}