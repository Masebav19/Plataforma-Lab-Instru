import { Box } from "@mui/material"
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LabelIcon from '@mui/icons-material/Label';
import ScienceIcon from '@mui/icons-material/Science';


interface MenuProps{
    value:number,
    SetValue:React.Dispatch<React.SetStateAction<number>>
}
export default function MenuBar({value,SetValue}:MenuProps){
    return(
        <Box
        component="div"
        sx={{width:"6vw",height:"100%"}}
        >
            <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
                event.preventDefault()
                SetValue(newValue);
            }}
            sx={{display:"flex",flexDirection:"column",height:"100%", 
                width:"100%",background:"transparent",border:"solid 1px var(--text)",
                boxShadow:"1px 1px 20px 0px var(--text)",borderRadius:"10px"
            }}
            >
                <BottomNavigationAction label="Tickets" icon={<LabelIcon />} />
                <BottomNavigationAction label="Sesiones" icon={<ScienceIcon />}/>
            </BottomNavigation>
        </Box>
    )
}