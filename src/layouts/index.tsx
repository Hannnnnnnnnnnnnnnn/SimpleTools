import React, { useEffect, useState } from "react";
import { ProLayout } from "@ant-design/pro-components";
import {
  Link,
  Outlet,
  useAppData,
  useLocation,
  setLocale,
  getLocale,
  useAntdConfigSetter,
  useAntdConfig,
  useIntl,
} from "umi";
import {
  Layout as AntdLayout,
  theme,
  Flex,
  Input,
  Space,
  Button,
  Tooltip,
  Select,
  Switch,
} from "antd";
import {
  GithubOutlined,
  SunFilled,
  SearchOutlined,
  MoonOutlined,
} from "@ant-design/icons";
const { darkAlgorithm, defaultAlgorithm } = theme;
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

const { Header, Content, Footer } = AntdLayout;

dayjs.locale("en");

export default function Layout() {
  const { clientRoutes } = useAppData();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [locale, setLocal] = useState<string>(getLocale());
  const [checked, setChecked] = useState<boolean>(true);
  const setAntdConfig = useAntdConfigSetter();
  const initl = useIntl();

  useEffect(() => {
    console.log("this...");
    const theme = localStorage.getItem("theme");
    if (theme === null) {
      localStorage.setItem("theme", "default");
    } else if (theme === "default") {
      setChecked(true);
      setAntdConfig({
        theme: {
          algorithm: [defaultAlgorithm],
        },
      });
    } else if (theme === "dark") {
      setChecked(false);
      setAntdConfig({
        theme: {
          algorithm: [darkAlgorithm],
        },
      });
    }
  }, []);

  return (
    <ProLayout
      route={clientRoutes[0]}
      location={location}
      title="Simple Tools"
      contentStyle={{ height: "100vh", padding: 0 }}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }
        if (menuItemProps.path && location.pathname !== menuItemProps.path) {
          return (
            <Link
              to={menuItemProps.path}
              target={menuItemProps.target}
            >
              {defaultDom}
            </Link>
          );
        }
        return defaultDom;
      }}
    >
      <AntdLayout>
        <Header style={{ height: 54, background: colorBgContainer }}>
          <Flex
            style={{ height: "100%" }}
            gap={16}
            justify="space-between"
          >
            <Input
              className=" flex justify-center items-center max-w-[280px]"
              placeholder={initl.formatMessage({ id: "输入关键字搜索..." })}
              variant="borderless"
              prefix={
                <SearchOutlined style={{ color: "rgba(0, 0, 0, 0.88)" }} />
              }
            />
            <Space>
              <Select
                value={locale}
                style={{ width: 120 }}
                popupMatchSelectWidth={false}
                onChange={(e) => {
                  console.log(e);
                  setLocale(e, false); // umi设置语言
                  setLocal(e); // select UI显示刷新
                }}
                options={[
                  { value: "zh-CN", label: "简体中文" },
                  { value: "en-US", label: "English(US)" },
                ]}
              />

              <Switch
                checked={checked}
                checkedChildren={<SunFilled />}
                unCheckedChildren={<MoonOutlined />}
                onChange={(checked) => {
                  setAntdConfig({
                    theme: {
                      algorithm: [checked ? defaultAlgorithm : darkAlgorithm],
                    },
                  });
                  setChecked(checked);
                  localStorage.setItem("theme", checked ? "default" : "dark");
                }}
              />

              <Tooltip title="GitHub">
                <Button
                  type="text"
                  icon={<GithubOutlined />}
                  onClick={() => {
                    window.open("https://github.com/");
                  }}
                ></Button>
              </Tooltip>
            </Space>
          </Flex>
        </Header>
        <Content style={{ margin: 20 }}>
          <div
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
            className=" overflow-auto h-full min-h-[360px] p-6"
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </AntdLayout>
    </ProLayout>
  );
}
