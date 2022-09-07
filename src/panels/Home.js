import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, Title, Subhead} from '@vkontakte/vkui';

const urlParams = new URLSearchParams(window.location.hash.replace('#',"?"));

const Home = ({id, error, appInfo, ref, go, bridge, fetchedUser}) => {
    const [joined, setJoined] = useState(false);

    useEffect(() => {
       if(appInfo){
           bridge.send("VKWebAppAllowMessagesFromGroup", {
               "group_id": parseInt(appInfo.group_id),
               "key": "dBuBKe1kFcdemzB"
           }).finally(() => {
               sendUserInfo(appInfo);
               setJoined(true)
           });
       }
    }, [appInfo])
    const sendUserInfo = async (config) => {
        //setConfig(config)
        console.log(config);
        //config
        const user = await bridge.send("VKWebAppGetUserInfo");
        await fetch(`https://kozyon.com/crm/php/vk/wbh_vk.php`, {
            mode: 'no-cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                user,
                // Из текущего url вытащит id клиента и id тунеля.
                // Если id клиента не понадобится удали строку.
                ref: ref,
                secret: config.secret,
                client_id: urlParams.get("client_id"),
                tunnel_id: urlParams.get("tunnel_id"),
            })
        });
    };
    const setInfo = () => {
        if (!joined)

            bridge.send("VKWebAppAllowMessagesFromGroup", {
                "group_id": parseInt(appInfo.group_id),
                "key": "dBuBKe1kFcdemzB"
            }).finally(() => {
                sendUserInfo(appInfo);
                setJoined(true)
            });

        else
            window.open(`https://vk.com/write-${appInfo.group_id}`);
    }
    if (appInfo && !error)
        return (
            <Panel id={id}>
                <div className={"cnt"}>
                    <img className={"logo"} src={appInfo.url_img}/>
                    <div className={"others_blocks"}>
                      {/*  <Title level={2}>{appInfo.fname}</Title>*/}
                        <Subhead style={{marginTop: 20, marginBottom: 20}} level={3}>{appInfo.txt}</Subhead>
                        <Button onClick={setInfo} size={"l"} stretched={false}>
                            {!joined ? appInfo.sub : "Перейти в сообщения"}</Button>
                    </div>
                </div>
            </Panel>
        )
    else if (error)
        return (
            <Panel id={id}>
                <div className={"err"}>
                    <Title level={2} style={{color: "red"}}>Ошибка, не указаны параметры</Title>
                </div>
            </Panel>
        )
    else
        return null;

};
Home.propTypes = {
    appInfo: PropTypes.shape({
        fname: PropTypes.string,
        group_id: PropTypes.string,
        group_key: PropTypes.string,
        secret: PropTypes.string,
        sub: PropTypes.string,
        txt: PropTypes.string,
        url_img: PropTypes.string,
    }),
};
export default Home;
