import { Theme } from '@mui/material'
import MUITextField from './textField'


const Overrides = (theme:Theme) => {
 

  return Object.assign(
    MUITextField(theme),
  )
}

export default Overrides
