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
import Home from './panels/Home';
import "./panels/main.css"

let protocol_ = platform() === IOS ? "vkcors" : "https"
const App = () => {
	const [scheme, setScheme] = useState('bright_light')
	const [activePanel, setActivePanel] = useState('home');
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
		let answer = await fetch(`${protocol_}://${hashes.find(x=>x.name === "d").value}/crm/php/vk/wbh_vk.php?ref=${hashes.find(x=>x.name === "ref").value}`)

		answer = await answer.json();
		setAppInfo(answer)
	}, []);
	useEffect(()=>{
		if(appInfo){
			console.log(appInfo)
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
								<Home protocol_={protocol_} error={error} ref={ref} id='home' bridge={bridge} appInfo={appInfo} fetchedUser={fetchedUser} go={go} />
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
