import './App.css';
import 'antd/dist/antd.min.css';
import { useEffect, useState } from 'react';
import { Table, Space, message, InputNumber, Row, Col, Upload, Modal, Button, Form, Input } from 'antd';
import axios from 'axios';
import { EditOutlined, DeleteOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const apiUrl = 'https://nphc-hr.free.beeceptor.com';

function UploadCSV({ refreshData }) {
  const uploadFile = async options => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
    };

    formData.append('file', file);
    axios
      .post(
        `${apiUrl}/employees/upload`, // there's multiple different api in the doc & mock api site, use this for now
        formData,
        config,
      )
      .then(response => {
        message.success(`${file.name} uploaded successfully`);
        onSuccess('Uploaded successfully.');
        refreshData();
      })
      .catch(err => {
        console.log('Error: ', err);
        message.error(`Error when uploading ${file.name}`);
        onError({ err });
      });
  };

  const uploadProps = {
    multiple: true, // TODO: need to fix ; seems to be able to upload multiple but have problem updating the status correctly. 
    customRequest: uploadFile,
    beforeUpload: (file) => {
      const isCSV = file.type === 'text/csv';

      if (!isCSV) {
        message.error(`${file.name} is not a csv file`);
      }

      let isFileSizeExceeded = false;
      // reject if exceeded file limit of 2mb
      if (file.size > 20000000) {
        message.error(`${file.name} exceeded the file limit of 2mb`);
        isFileSizeExceeded = true;
      }

      return (isCSV && !isFileSizeExceeded) || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
    },
    accept: '.csv'
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type='primary' onClick={showModal}>
        Click Here to Upload Data
      </Button>
      <Modal title='Upload' visible={isModalVisible} onOk={handleOk} okText='Done' cancelButtonProps={{ style: { display: 'none' } }}>
        <Upload {...uploadProps}>
          <Button>
            <UploadOutlined />Click here to Upload CSV file
          </Button>
        </Upload>
      </Modal>
    </div>
  );
}

// TODO: limit min/max value => max number should not be smaller than min number, vice versa
function SalaryFilter({ dataSource, onFilterChange }) {
  let defaultMinValue = 0, defaultMaxValue = 99999;
  const [minValue, setMinValue] = useState(defaultMinValue);
  const [maxValue, setMaxValue] = useState(defaultMaxValue);

  function handleMinValueChange(value) {
    setMinValue(value);
    onFilterChange(dataSource.filter(data => {
      if (minValue == null && maxValue == null) {
        return;
      } else if (maxValue == null) {
        return Number(data.salary) >= value;
      } else {
        return Number(data.salary) >= value && Number(data.salary) <= maxValue;
      }
    }));
  }

  function handleMaxValueChange(value) {
    setMaxValue(value);
    onFilterChange(dataSource.filter(data => {
      if (minValue == null && maxValue == null) {
        return;
      } else if (minValue == null) {
        return Number(data.salary) <= value;
      } else {
        return Number(data.salary) >= minValue && Number(data.salary) <= value;
      }
    }));
  }

  return (
    <Space>
      <div>Salary Range:</div>
      <div>Min</div>
      <InputNumber min={defaultMinValue} max={defaultMaxValue} prefix='$' onChange={handleMinValueChange} />
      <div>-</div>
      <div>Max</div>
      <InputNumber min={defaultMinValue} max={defaultMaxValue} prefix='$' onChange={handleMaxValueChange} />
    </Space>
  );
}

function ActionItems({ record, refreshData }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const submitEditApi = (editedRecord) => {
    console.log('submit edit api');
    axios
      .put(
        `${apiUrl}/employees/${record.id}`,
        editedRecord
      )
      .then(response => {
        message.success(`${editedRecord.full_name} edited successfully`);
        setIsModalVisible(false);
        refreshData();
      })
      .catch(err => {
        console.log('Error: ', err);
        message.error(`Error when editing ${editedRecord.full_name}`);
      });
  };

  const handleEditStudent = () => {
    form
      .validateFields()
      .then((values) => {
        submitEditApi(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDeleteStudent = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Delete User',
      content: `Are you sure you want to delete ${record.full_name}?`,
      okType: 'danger',
      onOk: () => {
        axios
          .delete(
            `${apiUrl}/employees/${record.id}`,
          )
          .then(response => {
            message.success(`${record.full_name} deleted successfully`);
            refreshData();
          })
          .catch(err => {
            console.log('Error: ', err);
            message.error(`Error when deleting ${record.full_name}`);
          });
        refreshData();
      }
    });
  };

  return (
    <Space>
      <EditOutlined onClick={showModal}></EditOutlined>
      <DeleteOutlined onClick={handleDeleteStudent}></DeleteOutlined>
      <Modal
        visible={isModalVisible}
        icon='<EditOutlined />'
        title='Edit User'
        onOk={handleEditStudent}
        okText='Submit'
        onCancel={handleCancel}
      >
        <Space direction='vertical'>
          <div> Employee ID {record.id}</div>
          <Form
            form={form}
            layout="vertical"
            name="form_in_modal"
            initialValues={record}
          >
            <Form.Item
              name="full_name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: 'Please insert name!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="login_id"
              label="Login"
              rules={[
                {
                  required: true,
                  message: 'Please insert login!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="salary"
              label="Salary"
              rules={[
                {
                  required: true,
                  message: 'Please insert salary!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </Space >
  );
}

function App() {
  const paginationConfig = {
    pageSizeOptions: ['5', '10', '15'],
    hideOnSinglePage: false,
  };
  // const [dataSource, setdataSource] = useState(generateDataSource(100));
  const [dataSource, setdataSource] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState(dataSource);

  useEffect(() => {
    refreshData()
  }, []);

  const refreshData = () => {
    console.log('data is refreshed');
    axios
      .get(`${apiUrl}/employees`)
      .then((response) => {
        console.log(response);
        setdataSource(response.data);
        setFilteredDataSource(response.data);
      }
      )
      .catch((error) => message.error('There is an error when getting employee data.', error.message));
  }

  // function generateDataSource(value) {
  //   let dataSourceArray = [];
  //   for (let i = 1; i <= value; i++) {
  //     dataSourceArray.push({
  //       key: i,
  //       id: i,
  //       full_name: 'Harry Potter ' + i,
  //       login_id: 'hpotter',
  //       salary: (i + 1049).toString(),
  //     });
  //   };
  //   return dataSourceArray;
  // }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: 'Login',
      dataIndex: 'login_id',
      key: 'login',
      sorter: (a, b) => a.login_id.localeCompare(b.login_id),
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      sorter: (a, b) => a.salary - b.salary,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <ActionItems record={record} refreshData={refreshData}></ActionItems>
      ),
    },
  ];

  return (
    <div className='App'>
      <Space size='middle' direction='vertical'>
        <UploadCSV refreshData={refreshData}></UploadCSV>
        <SalaryFilter
          dataSource={dataSource}
          onFilterChange={setFilteredDataSource}
        />
        <Table
          dataSource={filteredDataSource}
          columns={columns}
          pagination={paginationConfig}
        />
      </Space>
    </div>
  );
}

export default App;
