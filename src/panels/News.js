import React, {useEffect, useState} from "react"
import {Button, Div, Panel, Placeholder, ScreenSpinner, Subhead, Title, View} from "@vkontakte/vkui";
import {Icon20ArrowLeftOutline, Icon56ArchiveOutline} from "@vkontakte/icons";

const News = ({id, setActivePanel, protocol_, hashes}) => {
    const [ants, setAnts] = useState(null)
    const [popout, setPopout] = useState(<ScreenSpinner/>)
    useEffect(() => {
        fetchData();
    }, [])
    const fetchData = async () => {
        let content = await fetch(`${protocol_}://${hashes.find(x => x.name === "d").value}/crm/php/vk/wbh_vk.php?menu=2`);
        content = await content.json();
        setAnts(content);
        setPopout(null)
    }
    return (
        <View activePanel={id} popout={popout}>
            <Panel id={id}>
                <Div className={"div_d"}>
                    <img style={{width: 150}} className={"logo_img"}
                         src={"https://kozyon.com/crm/content/2022/10/logo.png"}/>
                    <div onClick={() => setActivePanel("main")} className={"div_back"}>
                        <Icon20ArrowLeftOutline/>
                        <span>Вернуться назад</span>
                    </div>
                    <Title style={{alignSelf: "start", fontWeight: 1000}} level={1}>Новости партнера</Title>
                    <div className={"d_dz"}>
                        {ants && ants.length === 0 &&
                            <Placeholder
                                icon={<Icon56ArchiveOutline/>}
                                header="Ничего не нашли"
                            >
                                Увы, пока тут пусто
                            </Placeholder>
                        }
                        {ants && ants.length > 0 && ants.map((item, key) => (
                            <div className={"block_d"} key={key}>
                                <img src={item.img}/>
                                <Subhead className={"span_date"}>{item.date}</Subhead>
                                <Subhead className={"span_desc"}>{item.desc}</Subhead>
                            </div>
                        ))}
                        <div style={{height: 50}}/>
                    </div>
                </Div>
            </Panel>
        </View>
    )
}
export default News