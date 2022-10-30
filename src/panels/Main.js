import React from "react"
import {Button, Div, Panel, Title} from "@vkontakte/vkui";


const Main = ({id,setActivePanel}) =>{
    return (
        <Panel id={id}>
            <Div className={"div_d"}>
                <img className={"logo_img"} src={"https://kozyon.com/crm/content/2022/10/logo.png"}/>
                <Title style={{textAlign:"center"}} level={2}>
                    Партнерская программа MetaFunnels
                </Title>
                <div className={"main_buttons"}>
                    <Button onClick={()=>setActivePanel("crm")} size={"l"} stretched>CRM</Button>
                    <Button onClick={()=>setActivePanel("news")} mode={"primary"} size={"l"} stretched>Новости партнера</Button>
                    <Button onClick={()=>setActivePanel("ant")} size={"l"} stretched>Аналитика партнера</Button>
                    <Button onClick={()=>setActivePanel("home")} size={"l"} stretched>Воронка партнера</Button>
                </div>
            </Div>
        </Panel>
    )
}

export default Main