import { useNavigate } from "react-router-dom";

import styles from "./PageOptions.module.css";

function PageOptions() {
    const navigation = useNavigate();

    const handleNavigation = (route) => {
        navigation(route);
    }
    
    return (
        <nav className={styles["page-options"]}>
            <button type="button" onClick={() => handleNavigation("/")}>Welcome</button>
            <button type="button" onClick={() => handleNavigation("/system-of-equations")}>System of Equations</button>
        </nav>
    )
}

export default PageOptions;