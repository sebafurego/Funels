import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner,platform,IOS, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
const url = new URL(window.location);
let hashes = url.hash ? url.hash.split("#")[1].split("&").map(x=>{
	return {
		name:x.split("=")[0],
		value:x.split("=")[1]
	}
}) : [];

let utm_source = hashes.find(x=>x.name === "utm_source") ?  hashes.find(x=>x.name === "utm_source").value : null;
let utm_medium = hashes.find(x=>x.name === "utm_medium") ?  hashes.find(x=>x.name === "utm_medium").value : null;
let utm_campaign = hashes.find(x=>x.name === "utm_campaign") ?  hashes.find(x=>x.name === "utm_campaign").value : null;
let utm_content = hashes.find(x=>x.name === "utm_content") ?  hashes.find(x=>x.name === "utm_content").value : null;
let utm_term = hashes.find(x=>x.name === "utm_term") ?  hashes.find(x=>x.name === "utm_term").value : null;

let utms = new URLSearchParams({
	utm_source,
	utm_medium,
	utm_campaign,
	utm_content,
	utm_term,
})

import Home from './panels/Home';
import "./panels/main.css"
import Main from "./panels/Main";
import Analythic from "./panels/Analythic";
import News from "./panels/News";

let protocol_ = platform() === IOS ? "https"/*"vkcors"*/ : "https"
const App = () => {
	const [scheme, setScheme] = useState('bright_light')
	const [activePanel, setActivePanel] = useState('');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [d] = useState(hashes.find(x=>x.name === "d"))
	const [ref] = useState(hashes.find(x=>x.name === "ref"))
	const [appInfo,setAppInfo] = useState(null)
	const [error,setError] = useState(false)
	useEffect(async () => {
		if((!hashes.find(x=>x.name === "d") || !hashes.find(x=>x.name === "d").value) || (!hashes.find(x=>x.name === "ref") || !hashes.find(x=>x.name === "ref").value)){
			//setError(true)
			hashes.push({
				name:"d",
				value:"kozyon.com"
			})
			hashes.push({
				name:"ref",
				value:"YnM6Zjo5MDs"
			})
		}
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				setScheme(data.scheme)
			}
		});

		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			return user
		}
		let user_ = await fetchData();
		let answer = await fetch(`${protocol_}://${hashes.find(x=>x.name === "d").value}/crm/php/vk/wbh_vk.php?ref=${hashes.find(x=>x.name === "ref").value}&${utms}`)
		if(!hashes.find(x=>x.name === "menu") || hashes.find(x=>x.name === "menu").value == 1){
			setActivePanel("main")
		}else if(hashes.find(x=>x.name === "menu") && hashes.find(x=>x.name === "menu").value == 2){
			setActivePanel("news")
		}else if(hashes.find(x=>x.name === "menu") && hashes.find(x=>x.name === "menu").value == 3){
			setActivePanel("ant")
		}
		else if(hashes.find(x=>x.name === "menu") && hashes.find(x=>x.name === "menu").value == 4){
			setActivePanel("home")
		}
		answer = await answer.json();
		setAppInfo(answer)
	}, []);
	useEffect(()=>{
		if(appInfo){
			setPopout(null)
		}
	},[appInfo])
	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<ConfigProvider scheme={scheme}>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout popout={popout}>
						<SplitCol>
							<View activePanel={activePanel}>
								<News protocol_={protocol_} hashes={hashes} setActivePanel={setActivePanel} id={"news"}/>
								<Analythic hashes={hashes} protocol_={protocol_} id={"ant"} setActivePanel={setActivePanel}/>
								<Main  setActivePanel={setActivePanel} id={"main"}/>
								<Home hashes={hashes} protocol_={protocol_} error={error} ref={ref} id='home' bridge={bridge} appInfo={appInfo} fetchedUser={fetchedUser} go={go} />
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
