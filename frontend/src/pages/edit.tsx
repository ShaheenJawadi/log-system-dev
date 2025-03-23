import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  OutlinedInput,
  InputAdornment,
  SelectChangeEvent,
} from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { LogEntry, LogEntryType } from "../types/logs";

 
const initialLog: LogEntry = {
  type: "off",
  start: 0,
  end: 0,
  remark: "",
};

const minutesToHHMM = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

const hhmmToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};
const roundToQuarterHour = (minutes: number): number => {
  return Math.round(minutes / 15) * 15;
};

const ELDEntryForm: React.FC = () => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [totalHours, setTotalHours] = useState<number>(0);

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toDateString();
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    let total = 0;
    logEntries.forEach((entry) => {
      total += entry.end - entry.start;
    });
    setTotalHours(total);

    if (logEntries.length > 0 && total !== 1440) {
      setError(
        `Total time is ${minutesToHHMM(
          total
        )} (${total} minutes). Must equal 24:00 (1440 minutes).`
      );
    } else {
      setError("");
    }
  }, [logEntries]);

  const handleAddEntry = (): void => {
    const lastEntryEnd =
      logEntries.length > 0 ? logEntries[logEntries.length - 1].end : 0;

    const remainingMinutes = 1440 - totalHours;

    const roundedRemainingMinutes = roundToQuarterHour(remainingMinutes);

    const newEntry: LogEntry = {
      ...initialLog,
      start: lastEntryEnd,
      end: lastEntryEnd + roundedRemainingMinutes,
    };

    setLogEntries([...logEntries, newEntry]);
  };

  const handleDeleteEntry = (index: number): void => {
    if (logEntries.length > 1) {
      const newEntries = [...logEntries];
      const deletedEntry = newEntries[index];
      const duration = deletedEntry.end - deletedEntry.start;

      newEntries.splice(index, 1);

      for (let i = index; i < newEntries.length; i++) {
        if (i === index) {
          newEntries[i].start = deletedEntry.start;
          newEntries[i].end = newEntries[i].end - duration;
        } else {
          newEntries[i].start = newEntries[i].start - duration;
          newEntries[i].end = newEntries[i].end - duration;
        }
      }

      setLogEntries(newEntries);
    } else {
      setError("Cannot delete the only entry. At least one entry is required.");
    }
  };

  const handleEntryChange = (
    index: number,
    field: keyof LogEntry,
    value: string | LogEntryType
  ): void => {
    const newEntries = [...logEntries];

    if (field === "type") {
      newEntries[index][field] = value as LogEntryType;
    } else if (field === "remark") {
      newEntries[index][field] = value as string;
    } else if (field === "start" || field === "end") {
      let minutes = hhmmToMinutes(value as string);

      minutes = roundToQuarterHour(minutes);

      if (field === "start") {
        if (minutes < newEntries[index].end) {
          newEntries[index].start = minutes;

          if (index > 0) {
            newEntries[index - 1].end = minutes;
          }
        }
      } else {
        if (minutes > newEntries[index].start) {
          newEntries[index].end = minutes;

          if (index < newEntries.length - 1) {
            newEntries[index + 1].start = minutes;
          }
        }
      }
    }

    setLogEntries(newEntries);
  };

  const generateTimeOptions = (): { value: string; label: string }[] => {
    const options = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        const timeValue = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push({
          value: timeValue,
          label: timeValue,
        });
      }
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleGenerateJson = ()  => {
    if (totalHours === 1440) {
 
      alert("Done");
    
    } else {
      setError("Total time must equal 24 hours.");
      return null;
    }
  };

  useEffect(() => {
    if (logEntries.length === 0) {
      setLogEntries([{ ...initialLog, end: 1440 }]); // def 24 h
    }
  }, []);

  const inputBoxing = { m: 1, width: "25ch" };

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        <FormControl variant="outlined" sx={{ ...inputBoxing }}>
          <InputLabel>Log date</InputLabel>
          <OutlinedInput
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            label="Current date"
            startAdornment={
              <InputAdornment position="start">
                <AccessTimeFilledIcon color="warning" />
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">
            Log Entries
            <Typography
              component="span"
              color={totalHours === 1440 ? "success.main" : "error.main"}
              sx={{ ml: 2 }}
            >
              Total: {minutesToHHMM(totalHours)} / 24:00
            </Typography>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={handleAddEntry}
          >
            Add Entry
          </Button>
        </Box>

        {error && (
          <Typography color="error.main" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logEntries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={entry.type}
                        onChange={(e: SelectChangeEvent<LogEntryType>) =>
                          handleEntryChange(
                            index,
                            "type",
                            e.target.value as LogEntryType
                          )
                        }
                      >
                        <MenuItem value="off">Off Duty</MenuItem>
                        <MenuItem value="sb">Sleeper Berth</MenuItem>
                        <MenuItem value="driving">Driving</MenuItem>
                        <MenuItem value="on">On Duty</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={minutesToHHMM(entry.start)}
                        onChange={(e) =>
                          handleEntryChange(index, "start", e.target.value)
                        }
                      >
                        {timeOptions.map((option) => (
                          <MenuItem
                            key={`start-${option.value}`}
                            value={option.value}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={minutesToHHMM(entry.end)}
                        onChange={(e) =>
                          handleEntryChange(index, "end", e.target.value)
                        }
                      >
                        {timeOptions.map((option) => (
                          <MenuItem
                            key={`end-${option.value}`}
                            value={option.value}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    {minutesToHHMM(entry.end - entry.start)}
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={entry.remark || ""}
                      onChange={(e) =>
                        handleEntryChange(index, "remark", e.target.value)
                      }
                      placeholder="Add remarks"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteEntry(index)}
                      disabled={logEntries.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleGenerateJson}
          disabled={totalHours !== 1440}
        >
          Check
        </Button>
      </Box>
    </Box>
  );
};

export default ELDEntryForm;
