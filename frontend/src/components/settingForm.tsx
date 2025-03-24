import { useFormik } from "formik";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Button,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InventoryIcon from "@mui/icons-material/Inventory";
import SaveIcon from "@mui/icons-material/Save";
import { SettingsType } from "../types/user";
const SettingsForm = (closeDialog: { closeDialog: () => void }) => {
  const formik = useFormik<SettingsType>({
    initialValues: {
      truckInfo: "",
      carrierName: "",
      officeAddress: "",
      terminalAddress: "",
      manifestNumber: "",
      shipperCommodity: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack padding={5} spacing={5}>
        <Typography variant="h4" color="primary" textAlign={"center"}>
          Settings
        </Typography>
        <Divider />
        <Typography variant="h6">
          These are the default settings for your ELD log sheet. You can update
          them at any time to match your current needs. 🚛📋
        </Typography>
        <FormControl variant="outlined">
          <InputLabel>Truck Info</InputLabel>
          <OutlinedInput
            type="text"
            name="truckInfo"
            label="Truck Info"
            value={formik.values.truckInfo}
            onChange={formik.handleChange}
            startAdornment={
              <InputAdornment position="start">
                <LocalShippingIcon color="primary" />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel>Carrier Name</InputLabel>
          <OutlinedInput
            type="text"
            name="carrierName"
            label="Carrier Name"
            value={formik.values.carrierName}
            onChange={formik.handleChange}
            startAdornment={
              <InputAdornment position="start">
                <BusinessIcon color="primary" />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel>Office Address</InputLabel>
          <OutlinedInput
            type="text"
            name="officeAddress"
            label="Office Address"
            value={formik.values.officeAddress}
            onChange={formik.handleChange}
            startAdornment={
              <InputAdornment position="start">
                <LocationOnIcon color="primary" />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel>Terminal Address</InputLabel>
          <OutlinedInput
            type="text"
            name="terminalAddress"
            label="Terminal Address"
            value={formik.values.terminalAddress}
            onChange={formik.handleChange}
            startAdornment={
              <InputAdornment position="start">
                <LocationOnIcon color="primary" />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel>Manifest Number</InputLabel>
          <OutlinedInput
            type="text"
            name="manifestNumber"
            label="Manifest Number"
            value={formik.values.manifestNumber}
            onChange={formik.handleChange}
            startAdornment={
              <InputAdornment position="start">
                <AssignmentIcon color="primary" />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel>Shipper Commodity</InputLabel>
          <OutlinedInput
            type="text"
            name="shipperCommodity"
            label="Shipper Commodity"
            value={formik.values.shipperCommodity}
            onChange={formik.handleChange}
            startAdornment={
              <InputAdornment position="start">
                <InventoryIcon color="primary" />
              </InputAdornment>
            }
          />
        </FormControl>

        <Button
          startIcon={<SaveIcon />}
          type="submit"
          size="large"
          variant="contained"
          color="secondary"
        >
          Save Settings
        </Button>
      </Stack>
    </form>
  );
};

export default SettingsForm;
