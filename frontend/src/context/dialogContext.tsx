import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import * as tripService from "../services/tripServices";
import * as logService from "../services/logServices";
import SettingForm from "../components/settingForm";
type DialogType = "deleteTrip" | "deleteLog" | "openSetting" | null;

interface DialogContextType {
  openDialog: (type: DialogType, params: { id: number }) => void;
  closeDialog: () => void;
  refresh:boolean;
}

const DialogContext = createContext<DialogContextType>({
  openDialog: () => {},
  closeDialog: () => {},
  refresh:false
});
export const useDialog = () => useContext(DialogContext);
export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [itemId, setItemId] = useState<number | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);


  const openDialog = (type: DialogType, params: { id: number }) => {
    setDialogType(type);
    setDialogOpen(true);
    setItemId(params.id);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType(null);
    setRefresh(!refresh);
  };


  
 
  return (
    <DialogContext.Provider value={{refresh, openDialog, closeDialog }}>
      {children}

      <Dialog
        open={dialogOpen}
        fullWidth={true}
        maxWidth={"sm"}
        onClose={closeDialog}
      >
   
            {(dialogType=="openSetting"  )&& (
          <SettingForm closeDialog={closeDialog}/>
        )}
   
        {(dialogType=="deleteLog"||dialogType=="deleteTrip"  )&& (
          <DeleteDialog
            target={dialogType}
            itemId={itemId} 
            closeDialog={closeDialog}
          />
        )}
      </Dialog>
    </DialogContext.Provider>
  );
};

interface DeleteDialogProps { 
  closeDialog: () => void;
  itemId: number | null;
  target: DialogType;
}

const DeleteDialog = ({ 
  closeDialog,
  itemId,
  target,
}: DeleteDialogProps) => {
  const deleteAction = async () => {
    try {
      if (target === "deleteTrip") {
        const response = await tripService.deleteTrip(itemId as number);
      } else if (target === "deleteLog") {
        const response = await logService.deleteLog(itemId as number);
      }
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      closeDialog();
    }
  };

  return (
    <>
      <DialogTitle>Delete Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this Log sheet?
          <br />
          Related trip will also be deleted <br /> This action cannot be
          undone⚠️
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog()} color="primary">
          No
        </Button>
        <Button onClick={() => deleteAction()} color="primary">
          Yes, Delete
        </Button>
      </DialogActions>
    </>
  );
};
