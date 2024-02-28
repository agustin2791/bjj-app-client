import { ArrowBack } from "@mui/icons-material"
import { Card, CardActions, CardContent, IconButton } from "@mui/material"
import { FC, ReactNode, } from "react"

type cardProps = {
    content?: JSX.Element,
    footer?: JSX.Element,
    children?: ReactNode,
    closeModal?: any
}

const SlotCard: FC<cardProps> = (props) => {
    const {content, footer, children, closeModal} = props

    return (
        <Card>
            <CardContent> 
                {content} 
            </CardContent>
            <CardContent>{children}</CardContent>
            {footer !== undefined && 
                <CardActions>{footer}</CardActions>
            }
        </Card>
    )
}

export default SlotCard;