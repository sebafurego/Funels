import React, {useEffect, useState} from "react"
import {Button, PanelHeader, Group,Select, Link, NativeSelect, CustomSelectOption, Text, Counter, Caption, FormLayoutGroup, ButtonGroup, FormItem, Header, Input, RichCell, Div, UsersStack, FormLayout, Avatar, Panel, Placeholder, ScreenSpinner, Subhead, Title, View} from "@vkontakte/vkui";
import {Icon20ArrowLeftOutline, Icon16SearchOutline, Icon24UserAddOutline, Icon16Verified, Icon56ArchiveOutline} from "@vkontakte/icons";

const Crm = ({id, setActivePanel, protocol_, appInfo, hashes}) => {
    const [ants, setAnts] = useState(null)
    const [popout, setPopout] = useState(<ScreenSpinner/>)
    const [result,setResult] = useState({'state':'login'})

    const user_card = (user='',result='') =>{
      var rand = (Math.floor(Math.random() * 1000000) + 1);
      var unread_num = Number(user['unread']);
      var fun_name = user['fun_name'];
      var crm_id = user['crm_id'];
      var col_name = user['col_name'];
      var flu_n = Number(user['flu_n']);
      var chat = user['chat'];
      var url = user['url'];
      var task_label = result['task_label'];
      var error_classes ="form_user_error n"+crm_id+" hidden r"+rand+" form_error";
      return (
        <Group>
          <RichCell
          style={{"padding":0}}
          before={<Avatar size={48} src={user['ava']} />}
          caption={<div>
            <div>
              <Link target="_blank" href={chat}>Переписка</Link>{({url}?<span> | </span>:'')}{({url}?<Link target="_blank" href={url}>Профиль</Link>:'')}
              <span> </span><Button mode="secondary" onClick={() => profile_click(crm_id,"read",'r'+rand)} size="s" data="read">Прочитать</Button>
            </div>
            <div>{fun_name}</div>
            {(col_name?<div>{col_name}</div>:'')}
          </div>}
          after={
              unread_num > 0 && (
                <Counter mode="primary" size="s">
                  {unread_num}
                </Counter>
              )
          }
          actions={ col_name &&
            <Group style={{"paddingBottom":"20px"}}>
              <FormItem style={{"padding":0}}>
                <ButtonGroup mode="horizontal" gap="s">
                  <NativeSelect id="ddlViewBy" defaultValue={Number(flu_n)-1} sizeY="10">
                    {task_label.map((item, key) => (
                          <option key={key} value={item['s']}>{item['n']}</option>
                    ))}
                  </NativeSelect>
                  <Button
                    size="s"
                    onClick={() => profile_click(crm_id,"check",'r'+rand)}
                    appearance="accent"
                    mode="primary"
                  >
                    Проверить
                  </Button>
                </ButtonGroup>
              </FormItem>
            </Group>
          }
          multiline
          disabled
        >
          {user['name']}
        </RichCell>
        <div className={error_classes}></div>
      </Group>
      );
    }
    const profile_click = (crm_id,act,rand) =>{
      var task_val = "";
      if(act=='check'){
        var e = document.getElementById("ddlViewBy");
        var value = e.value;
        var task_val = e.options[e.selectedIndex].value;
      }

      var form_error = document.querySelector(".form_user_error."+rand);
      var url = protocol_+'://'+hashes.find(x => x.name === "d").value+'/crm/php/vk/wbh_vk.php?menu=5&taskval='+task_val+'&secret='+appInfo['secret']+'&act='+act+'&crm_id='+crm_id+'&id='+vk_user['id'];
      //console.log(url);
      let content =  httpGet(url);
      content = JSON.parse(content);
      if(content){
        //form_user_error n18219
        var error = content['error'];
        if(error){
          form_error.innerHTML = error;
          if(form_error.classList.contains("hidden")){
            form_error.classList.remove("hidden");
            setTimeout(function(){
              form_error.classList.add("hidden");
            },3000);
          }
          return false;
        }
        var ar = {};
        ar['info'] = content;
        ar['state'] = Math.floor(Date.now() / 1000);
        //console.log(4);
        //console.log(result);
        //console.log(ar);
        setResult(ar);
      }
    }
    const search_click = () =>{
      var search = document.getElementById("search_crm_field").value;
      var button = document.querySelector("#search_crm_button");
      var form_error = document.querySelector(".form_crm_error");
      if(!search){
        form_error.innerHTML = 'Поисковое поле пустое';
        form_error.classList.remove("hidden");
        setTimeout(function(){
          form_error.classList.add("hidden");
        },3000);
        return false;
      }
      let content =  httpGet(protocol_+'://'+hashes.find(x => x.name === "d").value+'/crm/php/vk/wbh_vk.php?menu=5&secret='+appInfo['secret']+'&id='+vk_user['id']+'&search='+search);
      content = JSON.parse(content);
      if(content){
        var ar = {};
        ar['info'] = content;
        ar['state'] = Math.floor(Date.now() / 1000);
        //console.log(result);
        //console.log(ar);
        setResult(ar);
      }
    }
    const login_click = () =>{
      var pass = document.getElementById("secure_login").value;
      var button = document.querySelector("#secure_login_button");
      var form_error = document.querySelector(".form_login_error");

      var button_txt = button.textContent;
      if(!pass){
        form_error.innerHTML = 'У вас не заполнен пароль, пожалуйста введите его';
        form_error.classList.remove("hidden");
        return false;
      }
      button.innerHTML = "...Загрузка";
      let content =  httpGet(protocol_+'://'+hashes.find(x => x.name === "d").value+'/crm/php/vk/wbh_vk.php?menu=5&secret='+appInfo['secret']+'&id='+vk_user['id']+'&pass='+pass);
      content = JSON.parse(content);
      if(content){
        if(content['error']!=undefined){
          form_error.innerHTML = content['error'];
          form_error.classList.remove("hidden");
        } else {
          replace_content(content);
        }
      }
      //hidden
      button.innerHTML = button_txt;
    }

    useEffect(() => {
        fetchData(appInfo);
    }, [])

    function replace_content($result){
      var ar = {};
      ar['state']='crm';
      ar['info']=$result;
      setResult(ar);
    }

    const fetchData = async (appInfo) => {
      var url = `${protocol_}://${hashes.find(x => x.name === "d").value}/crm/php/vk/wbh_vk.php?menu=5&id=${vk_user['id']}`;
      let content = await fetch(url);
      content = await content.json();
      setAnts(content);
      setPopout(null)
    }
    const getAvatarUrl = () => {
        return 'https://avatars.githubusercontent.com/u/12426533?s=400&v=4';
    }
    function httpGet(theUrl){
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
      xmlHttp.send( null );
      return xmlHttp.responseText;
    }
    var pass_desc = (ants!=undefined?ants['pass_desc']:'');
    var search_desc = (ants!=undefined?ants['search_desc']:'');
    if(ants!=undefined&&ants['success']&&!first_crm_run ){
      first_crm_run = 1;
      replace_content(ants);
    }
    //var email = "333";
    //
    //var search_error = (result['info']['search_error']);
    return (
        <View activePanel={id} popout={popout}>
            <Panel id={id}>
              <PanelHeader>CRM</PanelHeader>
              <Div className={"div_d"}>
                  <div className={"logo_img_w"}><div className={"logo_img"}/>{logoMt()}</div>
                  <div onClick={() => setActivePanel("main")} className={"div_back"}>
                      <Icon20ArrowLeftOutline/>
                      <span>Вернуться назад</span>
                  </div>
                  <Title style={{alignSelf:"center",fontWeight: 1000}} level={1}>Управление CRM</Title>
              </Div>
              {result['state']=='login' &&
                <Div className={"area_login"}>
                  <FormLayout>
                    <FormItem top="Пароль" bottom={pass_desc}>
                      <Input type="password" id="secure_login" placeholder="Введите пароль" />
                    </FormItem>
                    <FormItem>
                      <Button size="l" stretched onClick={login_click}>
                        <div id="secure_login_button">Войти</div>
                      </Button>
                    </FormItem>
                  </FormLayout>
                  <div className="form_error form_login_error hidden"></div>
                </Div>
              }
              {result['state']!='login' &&
                <Div className={"area_crm"}>
                  <Caption level="3"><span className="text-muted">{result['info']['note']}</span></Caption>
                  {result['info']['unread'] &&
                    <div className="widget_unread">
                      <h4 style={{"marginBottom":"10px"}}>Непрочитанные сообщения</h4>
                      <Caption style={{"maxWidth":"100%","marginBottom":"10px"}} level="3"><span className="text-muted">{result['info']['unread_desc']}</span></Caption>
                      {result['info'] && result['info']['unread'].length > 0 && result['info']['unread'].map((item, key) => (
                          <div key={key}>{user_card(item,result['info'])}</div>
                      ))}
                      <Div style={{"padding":"20px"}}></Div>
                    </div>
                  }
                  <div className="widget_search">
                    <h4 style={{"marginBottom":"10px"}}>Поиск по CRM</h4>
                    <FormLayout>
                      <FormItem top="Имя клиента" bottom={search_desc} style={{"padding":"0 0 10px"}}>
                        <Input type="text" id="search_crm_field" placeholder="Иван Иванов" />
                      </FormItem>
                      <FormItem style={{"padding":0}}>
                        <Button size="l" stretched onClick={search_click} style={{"marginBottom":"10px"}} before=<Icon16SearchOutline/>>
                          <div id="search_crm_button"> Искать</div>
                        </Button>
                      <div className="form_crm_error hidden form_error"></div>
                      </FormItem>
                      
                    </FormLayout>
                    <Group>
                      {(result['info'] && result['info']['search_not_found']!=undefined?<h5 style={{"marginBottom":"10px"}}>{result['info']['search_not_found']}</h5>:'')}
                      {(result['info'] && result['info']['search'].length > 0?<h5 style={{"marginBottom":"10px"}}>Результатов: {result['info']['search'].length}</h5>:'')}
                      {result['info'] && result['info']['search'].length > 0 && result['info']['search'].map((item, key) => (
                          <div key={key}>{user_card(item,result['info'])}</div>
                      ))}
                    </Group>
                  </div>
                  <Div style={{"padding":"60px"}}></Div>
                </Div>
              }

            </Panel>
        </View>
    )
}

export default Crm


















