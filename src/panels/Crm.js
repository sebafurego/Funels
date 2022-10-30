import React, {useEffect, useState} from "react"
import {Button, PanelHeader, Group, ButtonGroup, Header, RichCell, Div, UsersStack, Avatar, Panel, Placeholder, ScreenSpinner, Subhead, Title, View} from "@vkontakte/vkui";
import {Icon20ArrowLeftOutline, Icon24UserAddOutline, Icon16Verified, Icon56ArchiveOutline} from "@vkontakte/icons";


const Crm = ({id, setActivePanel, protocol_, hashes}) => {
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
    const getAvatarUrl = () => {
        return 'https://avatars.githubusercontent.com/u/12426533?s=400&v=4';
    }
    return (
        <View activePanel={id} popout={popout}>
            <Panel id={id}>
                <PanelHeader>RichCell</PanelHeader>
                <Group>
                  <RichCell
                    before={<Avatar size={72} src={getAvatarUrl("")} />}
                    subhead="Subhead"
                    text="Text"
                    caption="Caption"
                    after="After"
                    afterCaption="After Caption"
                    bottom={
                      <UsersStack
                        photos={[getAvatarUrl(""), getAvatarUrl(""), getAvatarUrl("")]}
                      >
                        N общих друга
                      </UsersStack>
                    }
                    actions={
                      <ButtonGroup mode="horizontal" gap="s" stretched>
                        <Button mode="primary" size="s">
                          Primary
                        </Button>
                        <Button mode="secondary" size="s">
                          Secondary
                        </Button>
                      </ButtonGroup>
                    }
                    disabled
                  >
                    Children
                  </RichCell>
                </Group>
                <Group header={<Header>Рекомендации друзей</Header>}>
                  <RichCell
                    before={<Avatar size={72} src={getAvatarUrl("user_ilyagrshn")} />}
                    caption="Команда ВКонтакте, Санкт-Петербург"
                    bottom={
                      <UsersStack
                        photos={[
                          getAvatarUrl("user_ox"),
                          getAvatarUrl("user_vitalyavolyn"),
                          getAvatarUrl("user_eee"),
                        ]}
                      >
                        73 общих друга
                      </UsersStack>
                    }
                    actions={
                      <ButtonGroup mode="horizontal" gap="s" stretched>
                        <Button mode="primary" size="s">
                          Добавить
                        </Button>
                        <Button mode="secondary" size="s">
                          Скрыть
                        </Button>
                      </ButtonGroup>
                    }
                    disabled
                  >
                    Илья Гришин
                  </RichCell>
                  <RichCell
                    before={<Avatar size={72} src={getAvatarUrl("user_rom")} />}
                    after={<Icon24UserAddOutline />}
                    bottom={
                      <UsersStack
                        photos={[
                          getAvatarUrl("user_casper6479"),
                          getAvatarUrl("user_me"),
                          getAvatarUrl("user_evg"),
                        ]}
                      >
                        12 общих друзей
                      </UsersStack>
                    }
                    actions={
                      <ButtonGroup mode="horizontal" gap="s" stretched>
                        <Button mode="primary" size="s">
                          Добавить
                        </Button>
                        <Button mode="secondary" size="s">
                          Скрыть
                        </Button>
                      </ButtonGroup>
                    }
                    disabled
                  >
                    Ром Захаров
                  </RichCell>
                </Group>
                <Group header={<Header>История переводов</Header>}>
                  <RichCell
                    before={<Avatar size={48} src={getAvatarUrl("user_ti")} />}
                    text="Держи за обед в EZO"
                    caption="сегодня в 18:00"
                    after="+ 1 232 ₽"
                    afterCaption="Комиссия 1%"
                    actions={
                      <ButtonGroup mode="horizontal" gap="s" stretched>
                        <Button mode="primary" size="s">
                          Принять
                        </Button>
                        <Button mode="secondary" size="s">
                          Отклонить
                        </Button>
                      </ButtonGroup>
                    }
                    multiline
                    disabled
                  >
                    Тарас Иванов{" "}
                    <Icon16Verified
                      style={{
                        display: "inline-block",
                        color: "var(--vkui--color_icon_accent)",
                        verticalAlign: "text-top",
                      }}
                    />
                  </RichCell>
                  <RichCell
                    before={<Avatar size={48} src={getAvatarUrl("user_lihachyov")} />}
                    caption="Вчера в 20:30"
                    after="- 1 800 ₽"
                  >
                    Михаил Лихачев
                  </RichCell>
                </Group>
            </Panel>
        </View>
    )
}

export default Crm