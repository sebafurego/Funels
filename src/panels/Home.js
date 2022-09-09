import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {
    Panel,
    platform,
    IOS,
    ANDROID,
    PanelHeader,
    Header,
    Button,
    Group,
    Cell,
    Div,
    Avatar,
    Title,
    Subhead,
    Link
} from '@vkontakte/vkui';

const urlParams = new URLSearchParams(window.location.hash.replace('#',"?"));

const Home = ({id,protocol_, error, appInfo,hashes, ref, go, bridge, fetchedUser}) => {
    const [joined, setJoined] = useState(false);
    const plat = platform();
    useEffect(() => {
       if(appInfo){
           bridge.send("VKWebAppAllowMessagesFromGroup", {
               "group_id": parseInt(appInfo.group_id),
               "key": "dBuBKe1kFcdemzB"
           }).finally(() => {
               //TODO !
               window.open(`https://vk.com/write-${appInfo.group_id}`);
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
        await fetch(`${protocol_}://${hashes.find(x=>x.name === "d").value}/crm/php/vk/wbh_vk.php`, {
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
                <PanelHeader>{appInfo && appInfo.hasOwnProperty("title") ? appInfo.title : "MetaFunnels"}</PanelHeader>
                {/*style={{marginTop:plat === IOS ? 80 : plat === ANDROID ? 60 : 0}}*/}
                <div  className={"cnt"}>
                    <img className={"logo"} src={appInfo.url_img}/>
                    <div className={"others_blocks"}>
                      {/*  <Title level={2}>{appInfo.fname}</Title>*/}
                        <Subhead style={{marginTop: 20, marginBottom: 20}} level={3}>{appInfo.txt}</Subhead>
                        {joined && plat === IOS &&
                            <Link className={"linkoil"} href={`https://vk.com/write-${appInfo.group_id}`}>
                            <span className="vkuiButton__in Button__in">
                                <span className="vkuiButton__content Button__content vkuiHeadline vkuiHeadline--android Headline Headline--android vkuiHeadline--w-medium Headline--w-medium">
                                    {appInfo.hasOwnProperty("btn") ? appInfo.btn :"Перейти в сообщения"}
                                </span>
                            </span>

                            </Link>
                        }

                        {joined ? plat === IOS ? null :
                            <Button onClick={setInfo} size={"l"} stretched={false}>
                                {!joined ? appInfo.sub : appInfo.hasOwnProperty("btn") ? appInfo.btn :"Перейти в сообщения"}</Button>
                            :<Button onClick={setInfo} size={"l"} stretched={false}>
                                {!joined ? appInfo.sub : appInfo.hasOwnProperty("btn") ? appInfo.btn :"Перейти в сообщения"}</Button>
                        }

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
