import { Box } from "@mui/material";
import HeaderNotifications from "./Notifications";
import { ButtonTheme } from "../../components/";
import { CashRegisterPopover } from "./CashRegister/CashRegisterPopover.component";
import { SocketConnectionButton } from "./SocketConnectionButton/SocketConnectionButton.component";
import { selectAuth } from "../../../../../../redux";
import { useSelector } from "react-redux";
import { ValidRoles } from "../../../../Common/models/valid-roles.model";

function HeaderButtons() {
  const { user } = useSelector(selectAuth);

  return (
    <Box sx={{}}>
      {/* <HeaderSearch /> */}
      <Box sx={{ display: "flex", gap: 1 }} component="span">
        <ButtonTheme />

        <SocketConnectionButton />

        <HeaderNotifications />

        {user?.role.name === ValidRoles.admin && <CashRegisterPopover />}
      </Box>
    </Box>
  );
}

export default HeaderButtons;
