import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import {
  Stack,
  Grid2 as Grid,
  Typography,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { LogDay, LogEntry, LogSheet } from "../../../types/logs";
import ELDEntryForm from "./ELDEntry";
import * as logService from "../../../services/logServices";
import { useNavigate } from "react-router-dom";
import { appPaths } from "../../../routes/paths";
import DriverSheet from "../sheet";
const logSheetValidationSchema = Yup.object({
  totalMilesToday: Yup.number().nullable().typeError("Must be a number"),
  totalMileageToday: Yup.number().nullable().typeError("Must be a number"),
  truckInfo: Yup.string().nullable(),
  carrierName: Yup.string().nullable(),
  officeAddress: Yup.string().nullable(),
  terminalAddress: Yup.string().nullable(),
  manifestNumber: Yup.string().nullable(),
  shipperCommodity: Yup.string().nullable(),
  date: Yup.string().nullable(),
  fromLocation: Yup.string().nullable(),
  toLocation: Yup.string().nullable(),
  OnDutyHoursToday: Yup.number().nullable().typeError("Must be a number"),
  totalOnDutyLast7Days: Yup.number().nullable().typeError("Must be a number"),
  totalAvailableTomorrow70: Yup.number()
    .nullable()
    .typeError("Must be a number"),
  totalOnDutyLast5Days: Yup.number().nullable().typeError("Must be a number"),
  totalOnDutyLast8Days: Yup.number().nullable().typeError("Must be a number"),
  totalAvailableTomorrow60: Yup.number()
    .nullable()
    .typeError("Must be a number"),
  totalOnDutyLast7Days60: Yup.number().nullable().typeError("Must be a number"),
});

interface LogSheetFormProps {
  initialData?: LogSheet;
  entryData: LogEntry[];
  onSubmit: (values: LogDay) => Promise<void>;
  isUpdate?: boolean;
}

const LogSheetForm: React.FC<LogSheetFormProps> = ({
  initialData = {},
  onSubmit,
  isUpdate = false,
  entryData = [],
}) => {
  const [logData, setLogData] = useState<LogEntry[]>(entryData);
  const [entryError, setEntryError] = useState<boolean>(false);
  const [isPreview, setPreview] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      totalMilesToday: initialData.totalMilesToday || null,
      totalMileageToday: initialData.totalMileageToday || null,
      truckInfo: initialData.truckInfo || null,
      carrierName: initialData.carrierName || null,
      officeAddress: initialData.officeAddress || null,
      terminalAddress: initialData.terminalAddress || null,
      manifestNumber: initialData.manifestNumber || null,
      shipperCommodity: initialData.shipperCommodity || null,
      date:  moment(initialData.date ).format("YYYY-MM-DD")|| moment().format("YYYY-MM-DD"),
      fromLocation: initialData.fromLocation || null,
      toLocation: initialData.toLocation || null,
      OnDutyHoursToday: initialData.OnDutyHoursToday || null,
      totalOnDutyLast7Days: initialData.totalOnDutyLast7Days || null,
      totalAvailableTomorrow70: initialData.totalAvailableTomorrow70 || null,
      totalOnDutyLast5Days: initialData.totalOnDutyLast5Days || null,
      totalOnDutyLast8Days: initialData.totalOnDutyLast8Days || null,
      totalAvailableTomorrow60: initialData.totalAvailableTomorrow60 || null,
      totalOnDutyLast7Days60: initialData.totalOnDutyLast7Days60 || null,
    },
    validationSchema: logSheetValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onSubmit({
          log_sheet: values,
          entries: logData,
          id: 0,
          trip: 0,
          date: values.date,
        });
      } catch (error) {
        console.error("Form submission failed", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const conData = (): LogDay => {
    console.log("formik.values sqkljdhqjks hdjksq hdjksq hdjk sq");
    console.log(logData);
    console.log("formik.values sqkljdhqjks hdjksq hdjksq hdjk sq");
    return {
      log_sheet: formik.values,
      entries: logData,
      id: 0,
      trip: 0,
      date: formik.values.date,
    };
  };
  return (
    <Stack spacing={4} component="form" onSubmit={formik.handleSubmit}>
      <Grid justifyContent={"center"} container spacing={2}>
        <Grid size={{ xl: 6, md: 12 }}>
          <Paper elevation={2} sx={{ padding: 3 }}>
            <Stack spacing={5}>
              <FirstSecForm formik={formik} />
              <SecondSecForm formik={formik} />
              <Box>
                <SectionTitle title="Log Entries" />
                <ELDEntryForm
                  initialEntry={logData}
                  setEntryError={(isErr) => setEntryError(isErr)}
                  setLogData={(entry) => setLogData(entry)}
                />
              </Box>

              <ShippingSectionForm formik={formik} />

              <HourRecapSectionForm formik={formik} />
            </Stack>
          </Paper>
        </Grid>
        {
          isPreview && (<Grid size={{ xl: 6, md: 12 }}>
            <Paper elevation={2} sx={{ padding: 3 }}>
              <DriverSheet logsData={conData()} />
            </Paper>
          </Grid>)
        }
        
      </Grid>

      <Stack direction={"row"} spacing={2} justifyContent={"center"}>
        {!isPreview ? (
          <Button
            size="large"
            color="warning"
            variant="contained"
            disabled={formik.isSubmitting || entryError}
            startIcon={<VisibilityIcon />}
            onClick={() => setPreview(true)}
          >
            Preview Log sheet
          </Button>
        ) : (
          <Button
            size="large"
            color="secondary"
            variant="contained"
            disabled={formik.isSubmitting || entryError}
            startIcon={<EditIcon />}
            onClick={() => setPreview(false)}
          >
            Hide preview
          </Button>
        )}
        <Button
          size="large"
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting || entryError}
        >
          {formik.isSubmitting
            ? isUpdate
              ? "Updating..."
              : "Creating..."
            : isUpdate
            ? "Update Log Sheet"
            : "Create Log Sheet"}
        </Button>
      </Stack>
    </Stack>
  );
};

const SectionTitle = (title: { title: string }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2} paddingY={2}>
      <Box>
        <Typography fontSize={25} fontWeight={600} color="secondary">
          {title.title}
        </Typography>
      </Box>
      <Box flex={1}>
        <Divider sx={{ bgcolor: "primary.light" }} />
      </Box>
    </Stack>
  );
};

interface FormSectionProps {
  formik: any;
}

const FirstSecForm: React.FC<FormSectionProps> = ({ formik }) => {
  return (
    <Stack spacing={3}>
      <SectionTitle title="Driver's Daily Log Information" />

      <Grid container spacing={3} justifyContent={"center"}>
        <Grid size={4}>
          <Stack justifyContent={"center"}>
            <FormControl
              fullWidth
              variant="outlined"
              error={formik.touched.date && Boolean(formik.errors.date)}
            >
              <InputLabel>Date</InputLabel>
              <OutlinedInput
                type="date"
                name="date"
                value={formik.values.date || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Date"
              />
              {formik.touched.date && formik.errors.date && (
                <FormHelperText>{formik.errors.date}</FormHelperText>
              )}
            </FormControl>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={6}>
          <FormControl
            fullWidth
            variant="outlined"
            error={
              formik.touched.fromLocation && Boolean(formik.errors.fromLocation)
            }
          >
            <InputLabel>From Location</InputLabel>
            <OutlinedInput
              type="text"
              name="fromLocation"
              value={formik.values.fromLocation || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="From Location"
            />
            {formik.touched.fromLocation && formik.errors.fromLocation && (
              <FormHelperText>{formik.errors.fromLocation}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid size={6}>
          <FormControl
            fullWidth
            variant="outlined"
            error={
              formik.touched.toLocation && Boolean(formik.errors.toLocation)
            }
          >
            <InputLabel>To Location</InputLabel>
            <OutlinedInput
              type="text"
              name="toLocation"
              value={formik.values.toLocation || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="To Location"
            />
            {formik.touched.toLocation && formik.errors.toLocation && (
              <FormHelperText>{formik.errors.toLocation}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Stack>
  );
};

const SecondSecForm: React.FC<FormSectionProps> = ({ formik }) => {
  return (
    <Stack spacing={3}>
      <SectionTitle title="Vehicle and Carrier Information" />
      <Grid container spacing={3}>
        <Grid size={6}>
          <Stack spacing={10}>
            <Grid container spacing={3}>
              <Grid size={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={
                    formik.touched.totalMilesToday &&
                    Boolean(formik.errors.totalMilesToday)
                  }
                >
                  <InputLabel>Total Miles Driving Today</InputLabel>
                  <OutlinedInput
                    type="number"
                    name="totalMilesToday"
                    value={formik.values.totalMilesToday || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Total Miles Driving Today"
                  />
                  {formik.touched.totalMilesToday &&
                    formik.errors.totalMilesToday && (
                      <FormHelperText>
                        {formik.errors.totalMilesToday}
                      </FormHelperText>
                    )}
                </FormControl>
              </Grid>

              <Grid size={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={
                    formik.touched.totalMileageToday &&
                    Boolean(formik.errors.totalMileageToday)
                  }
                >
                  <InputLabel>Total Mileage Today</InputLabel>
                  <OutlinedInput
                    type="number"
                    name="totalMileageToday"
                    value={formik.values.totalMileageToday || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Total Mileage Today"
                  />
                  {formik.touched.totalMileageToday &&
                    formik.errors.totalMileageToday && (
                      <FormHelperText>
                        {formik.errors.totalMileageToday}
                      </FormHelperText>
                    )}
                </FormControl>
              </Grid>
            </Grid>

            <FormControl
              fullWidth
              variant="outlined"
              error={
                formik.touched.truckInfo && Boolean(formik.errors.truckInfo)
              }
            >
              <InputLabel>Truck/Tractor and Trailer Numbers</InputLabel>
              <OutlinedInput
                type="text"
                name="truckInfo"
                value={formik.values.truckInfo || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Truck/Tractor and Trailer Numbers"
              />
              {formik.touched.truckInfo && formik.errors.truckInfo && (
                <FormHelperText>{formik.errors.truckInfo}</FormHelperText>
              )}
            </FormControl>
          </Stack>
        </Grid>
        <Grid size={6}>
          <Stack spacing={3}>
            <FormControl
              fullWidth
              variant="outlined"
              error={
                formik.touched.carrierName && Boolean(formik.errors.carrierName)
              }
            >
              <InputLabel>Name of Carrier or Carriers</InputLabel>
              <OutlinedInput
                type="text"
                name="carrierName"
                value={formik.values.carrierName || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Name of Carrier or Carriers"
              />
              {formik.touched.carrierName && formik.errors.carrierName && (
                <FormHelperText>{formik.errors.carrierName}</FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              variant="outlined"
              error={
                formik.touched.officeAddress &&
                Boolean(formik.errors.officeAddress)
              }
            >
              <InputLabel>Main Office Address</InputLabel>
              <OutlinedInput
                type="text"
                name="officeAddress"
                value={formik.values.officeAddress || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Main Office Address"
              />
              {formik.touched.officeAddress && formik.errors.officeAddress && (
                <FormHelperText>{formik.errors.officeAddress}</FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              variant="outlined"
              error={
                formik.touched.terminalAddress &&
                Boolean(formik.errors.terminalAddress)
              }
            >
              <InputLabel>Home Terminal Address</InputLabel>
              <OutlinedInput
                type="text"
                name="terminalAddress"
                value={formik.values.terminalAddress || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Home Terminal Address"
              />
              {formik.touched.terminalAddress &&
                formik.errors.terminalAddress && (
                  <FormHelperText>
                    {formik.errors.terminalAddress}
                  </FormHelperText>
                )}
            </FormControl>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

const ShippingSectionForm: React.FC<FormSectionProps> = ({ formik }) => {
  return (
    <Stack spacing={3}>
      <SectionTitle title="Shipping Information" />

      <FormControl
        fullWidth
        variant="outlined"
        error={
          formik.touched.manifestNumber && Boolean(formik.errors.manifestNumber)
        }
      >
        <InputLabel>DVL or Manifest Number</InputLabel>
        <OutlinedInput
          type="text"
          name="manifestNumber"
          value={formik.values.manifestNumber || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="DVL or Manifest Number"
        />
        {formik.touched.manifestNumber && formik.errors.manifestNumber && (
          <FormHelperText>{formik.errors.manifestNumber}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth
        variant="outlined"
        error={
          formik.touched.shipperCommodity &&
          Boolean(formik.errors.shipperCommodity)
        }
      >
        <InputLabel>Shipper & Commodity</InputLabel>
        <OutlinedInput
          type="text"
          name="shipperCommodity"
          value={formik.values.shipperCommodity || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Shipper & Commodity"
        />
        {formik.touched.shipperCommodity && formik.errors.shipperCommodity && (
          <FormHelperText>{formik.errors.shipperCommodity}</FormHelperText>
        )}
      </FormControl>
    </Stack>
  );
};

const HourRecapSectionForm: React.FC<FormSectionProps> = ({ formik }) => {
  return (
    <Stack spacing={3}>
      <SectionTitle title="Hour Recap Information" />
      <Grid container justifyContent={"center"} spacing={3}>
        <Grid size={4}>
          <FormControl
            fullWidth
            variant="outlined"
            error={
              formik.touched.OnDutyHoursToday &&
              Boolean(formik.errors.OnDutyHoursToday)
            }
          >
            <InputLabel>On Duty Hours Today</InputLabel>
            <OutlinedInput
              type="number"
              name="OnDutyHoursToday"
              value={formik.values.OnDutyHoursToday || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="On Duty Hours Today"
            />
            {formik.touched.OnDutyHoursToday &&
              formik.errors.OnDutyHoursToday && (
                <FormHelperText>
                  {formik.errors.OnDutyHoursToday}
                </FormHelperText>
              )}
          </FormControl>
        </Grid>
      </Grid>

      <Typography variant="body2" fontWeight={600} color="primary">
        70 Hour/ 8 Day Drivers
      </Typography>
      <Grid container spacing={3}>
        <Grid size={4}>
          <FormControl
            fullWidth
            variant="outlined"
            error={
              formik.touched.totalOnDutyLast7Days &&
              Boolean(formik.errors.totalOnDutyLast7Days)
            }
          >
            <InputLabel>
              A. Total hours on duty last 7 days including today.
            </InputLabel>
            <OutlinedInput
              type="number"
              name="totalOnDutyLast7Days"
              value={formik.values.totalOnDutyLast7Days || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="A. Total hours on duty last 7 days including today."
            />
            {formik.touched.totalOnDutyLast7Days &&
              formik.errors.totalOnDutyLast7Days && (
                <FormHelperText>
                  {formik.errors.totalOnDutyLast7Days}
                </FormHelperText>
              )}
          </FormControl>
        </Grid>

        <Grid size={4}>
          <FormControl
            fullWidth
            variant="outlined"
            error={
              formik.touched.totalAvailableTomorrow70 &&
              Boolean(formik.errors.totalAvailableTomorrow70)
            }
          >
            <InputLabel>
              B. Total hours available tomorrow 70 hr. minus A*.
            </InputLabel>
            <OutlinedInput
              type="number"
              name="totalAvailableTomorrow70"
              value={formik.values.totalAvailableTomorrow70 || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="B. Total hours available tomorrow 70 hr. minus A*."
            />
            {formik.touched.totalAvailableTomorrow70 &&
              formik.errors.totalAvailableTomorrow70 && (
                <FormHelperText>
                  {formik.errors.totalAvailableTomorrow70}
                </FormHelperText>
              )}
          </FormControl>
        </Grid>

        <Grid size={4}>
          <FormControl
            fullWidth
            variant="outlined"
            error={
              formik.touched.totalOnDutyLast5Days &&
              Boolean(formik.errors.totalOnDutyLast5Days)
            }
          >
            <InputLabel>
              C. Total hours on duty last 5 days including today.
            </InputLabel>
            <OutlinedInput
              type="number"
              name="totalOnDutyLast5Days"
              value={formik.values.totalOnDutyLast5Days || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="C. Total hours on duty last 5 days including today."
            />
            {formik.touched.totalOnDutyLast5Days &&
              formik.errors.totalOnDutyLast5Days && (
                <FormHelperText>
                  {formik.errors.totalOnDutyLast5Days}
                </FormHelperText>
              )}
          </FormControl>
        </Grid>
      </Grid>

      <Typography variant="body2" fontWeight={600} color="primary">
        60 Hour/ 7 Day Drivers
      </Typography>
      <Grid container spacing={3}>
        <Grid size={4}>
          <FormControl
            fullWidth
            variant="outlined"
            error={
              formik.touched.totalOnDutyLast8Days &&
              Boolean(formik.errors.totalOnDutyLast8Days)
            }
          >
            <InputLabel>
              A. Total hours on duty last 8 days including today.
            </InputLabel>
            <OutlinedInput
              type="number"
              name="totalOnDutyLast8Days"
              value={formik.values.totalOnDutyLast8Days || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="A. Total hours on duty last 8 days including today."
            />
            {formik.touched.totalOnDutyLast8Days &&
              formik.errors.totalOnDutyLast8Days && (
                <FormHelperText>
                  {formik.errors.totalOnDutyLast8Days}
                </FormHelperText>
              )}
          </FormControl>
        </Grid>

        <Grid size={4}>
          <FormControl
            fullWidth
            variant="outlined"
            error={
              formik.touched.totalAvailableTomorrow60 &&
              Boolean(formik.errors.totalAvailableTomorrow60)
            }
          >
            <InputLabel>
              B. Total hours available tomorrow 60 hr. minus A
            </InputLabel>
            <OutlinedInput
              type="number"
              name="totalAvailableTomorrow60"
              value={formik.values.totalAvailableTomorrow60 || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="B. Total hours available tomorrow 60 hr. minus A"
            />
            {formik.touched.totalAvailableTomorrow60 &&
              formik.errors.totalAvailableTomorrow60 && (
                <FormHelperText>
                  {formik.errors.totalAvailableTomorrow60}
                </FormHelperText>
              )}
          </FormControl>
        </Grid>

        <Grid size={4}>
          <FormControl
            fullWidth
            variant="outlined"
            error={
              formik.touched.totalOnDutyLast7Days60 &&
              Boolean(formik.errors.totalOnDutyLast7Days60)
            }
          >
            <InputLabel>
              C. Total hours on duty last 7 days including today.
            </InputLabel>
            <OutlinedInput
              type="number"
              name="totalOnDutyLast7Days60"
              value={formik.values.totalOnDutyLast7Days60 || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="C. Total hours on duty last 7 days including today."
            />
            {formik.touched.totalOnDutyLast7Days60 &&
              formik.errors.totalOnDutyLast7Days60 && (
                <FormHelperText>
                  {formik.errors.totalOnDutyLast7Days60}
                </FormHelperText>
              )}
          </FormControl>
        </Grid>
      </Grid>
    </Stack>
  );
};
interface LogSheetFormPageProps {
  initialData: LogDay | null;
  isUpdate?: boolean;
}
const LogSheetFormPage: React.FC<LogSheetFormPageProps> = ({
  initialData = null,
  isUpdate = false,
}) => {
  const navigate = useNavigate();
  const handleSubmit = async (values: LogDay) => {
    try {
      if (isUpdate) {
        const res = await logService.updateLog({
          ...values,
          id: initialData?.id || 0,
        });
        navigate(appPaths.singleLog.replace(":id", res.id.toString()));
      } else {
        const res = await logService.createLog(values);
        navigate(appPaths.singleLog.replace(":id", res.id.toString()));
      }

      console.log(values);
    } catch (error) {
      console.error("Form submission failed", error);
    }
  };

  return (
    <LogSheetForm
      entryData={initialData?.entries || []}
      initialData={initialData?.log_sheet ? initialData.log_sheet : {}}
      onSubmit={handleSubmit}
      isUpdate={isUpdate}
    />
  );
};

export default LogSheetFormPage;
