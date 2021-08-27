import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AccessibleForwardIcon from '@material-ui/icons/AccessibleForward';
import MenuIcon from '@material-ui/icons/Menu';
import React from "react";
import Link from 'next/link'
import appTheme from '../styles/theme'
import HomeIcon from '@material-ui/icons/Home';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
        flexShrink: 0,
        width: drawerWidth
    },
    drawerPaper: {
        width: drawerWidth
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
    },
    toolbar: {
        ...theme.mixins.toolbar,
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3)
    }
}));


export const Layout = ({ children }) => {
    const classes = useStyles(appTheme);
    const theme = appTheme;
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = event => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setOpen(!open);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={toggleDrawer}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        <Link href="/">Dank Fitness</Link>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant={isMdUp ? "permanent" : "temporary"}
                classes={{
                    paper: classes.drawerPaper
                }}
                anchor="left"
                open={open}
                onClose={toggleDrawer}
            >
                <div className={classes.toolbar} />
                <Divider />
                <List>
                    <Link href="/" passHref>
                        <ListItem button component="a">
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText>Dank Fitness</ListItemText>
                        </ListItem>
                    </Link>
                    <Link href="/tools/plates" passHref>
                        <ListItem button component="a">
                            <ListItemIcon>
                                <AccessibleForwardIcon />
                            </ListItemIcon>
                            <ListItemText>Plate Calculator</ListItemText>
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
            <main className={classes.content}>
                <Toolbar />
                {children}
            </main>
        </div>
    );
}

export default Layout