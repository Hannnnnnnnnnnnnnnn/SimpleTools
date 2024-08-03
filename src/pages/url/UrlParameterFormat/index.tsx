import React, { useState } from "react";
import {
  Button,
  Flex,
  Card,
  Form,
  Input,
  Row,
  Col,
  Space,
  Table,
  message,
} from "antd";
import type { TableProps, FormProps } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { createSearchParams, useIntl, FormattedMessage } from "umi";

const { TextArea } = Input;

interface DataType {
  key: string;
  value: string;
}

type FormFieldType = {
  url: string;
};

type CopyObjectType = {
  [key: string]: any;
};

const UrlParameterFormat: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [form] = Form.useForm<FormFieldType>();
  const intl = useIntl();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: intl.formatMessage({ id: "键" }),
      dataIndex: "key",
    },
    {
      title: intl.formatMessage({ id: "值" }),
      dataIndex: "value",
    },
    {
      title: intl.formatMessage({ id: "操作" }),
      fixed: "right",
      render(value) {
        return (
          <Button
            type="primary"
            icon={<CopyOutlined />}
            onClick={() => {
              writeStrToClipboard(JSON.stringify(value));
            }}
          >
            Copy
          </Button>
        );
      },
    },
  ];

  const onFinish: FormProps<FormFieldType>["onFinish"] = (values) => {
    if (!values.url?.trim()) {
      message.error("请输入url");
    }

    const _url = values.url.trim();
    const [url, tailParam] = _url.split("?");

    const searchParams = createSearchParams(tailParam);
    const param: DataType[] = [];
    for (const [key, value] of searchParams.entries()) {
      param.push({ key, value });
    }

    console.log("param: ", param);
    setTableData(param);
    setUrl(url);
  };

  const reset = () => {
    console.log("reset");
    setUrl("");
    setTableData([]);
    form.resetFields();
  };

  const writeStrToClipboard = (str: string) => {
    navigator.clipboard
      .writeText(str)
      .then(() => {
        message.success("复制成功");
      })
      .catch(() => {
        message.error("复制失败,请尝试升级浏览器版本");
      });
  };

  const copyKeyValues = () => {
    const obj: CopyObjectType = {};
    tableData.forEach(({ key, value }) => {
      obj[key] = value;
    });
    writeStrToClipboard(JSON.stringify(obj));
  };

  const copyURL = () => {
    writeStrToClipboard(url);
  };

  return (
    <Card
      title={intl.formatMessage({ id: "URL参数格式化" })}
      style={{ width: "100%" }}
    >
      <Form
        onFinish={onFinish}
        form={form}
      >
        <Row>
          <Col span={24}>
            <Form.Item name="url">
              <TextArea
                style={{ width: "100%" }}
                autoSize={{ minRows: 4, maxRows: 16 }}
                placeholder={intl.formatMessage({ id: "请输入URL" })}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={8}>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                >
                  <FormattedMessage id="URL参数格式化" />
                </Button>
                <Button
                  type="default"
                  onClick={reset}
                >
                  <FormattedMessage id="重置" />
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Flex
        vertical
        gap="middle"
      >
        <Input
          addonBefore="URL"
          value={url}
          disabled
        />
        <Space>
          <Button
            style={{ maxWidth: 100 }}
            onClick={copyURL}
            disabled={url === ""}
          >
            <FormattedMessage id="复制URL" />
          </Button>
          <Button
            style={{ maxWidth: 100 }}
            onClick={copyKeyValues}
            disabled={tableData.length === 0}
          >
            <FormattedMessage id="复制键值对" />
          </Button>
        </Space>
        <Table
          columns={columns}
          scroll={{ x: "max-content" }}
          dataSource={tableData}
          pagination={false}
          bordered
        />
      </Flex>
    </Card>
  );
};

export default UrlParameterFormat;
