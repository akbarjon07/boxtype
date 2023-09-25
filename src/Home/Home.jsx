import "./home.css";
import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, Switch, Form, Input, Table, Pagination } from 'antd';
import axios from 'axios';

const Home = () => {

    const [dataSource, setDataSource] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
          key: 1,
          title: "Название",
          dataIndex: "name",
          type:"input"
        },
        {
          key: 2,
          title: "Описание",
          dataIndex: "description",
          type:"input"
        },
        {
          key: 3,
          title: "Код",
          dataIndex: "code",
          type:"input"
        },
        {
            key: 4,
            title: "Состояние",
            dataIndex: "is_active",
            type:"input",
            render: (record,row) => {
                return String(row.is_active);
            }
        },
        {
            key: 5,
            title: "",
            render: (record) => {
                return (
                    <>
                        <button onClick={()=>editFunc(record.id)} className='edit-btn' id='edit-btn'><i className="bi bi-pencil-square"></i></button>

                        <button onClick={() => {Modal.confirm({
                            title: "Вы точно хотите удалить?",
                            okText: "Да",
                            cancelText: "Отмена",
                            okType: "danger",
                            onOk: () => {deleteData(record)}
                        })}}
                            className='del-btn ml-10'><i className="bi bi-trash"></i></button>
                    </>
                )
            }
        },
    ];

    const [form] = Form.useForm();

    ///// POST MODAL MANIPULATION /////

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    ///// POST EDIT MODAL MANIPULATION /////

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const showEditModal = () => {
        setIsEditModalOpen(true);
    };
    const handleEditOk = () => {
        setIsEditModalOpen(false);
    };
    const handleEditCancel = () => {
        setIsEditModalOpen(false);
    };

    ///// GET TOKEN /////

    const token = localStorage.getItem("token");

    ///// POST DATA /////

    const onFinish = (values) => {
        console.log('Success:', values);

        const fetchData = () => {
            axios.post('https://sherzod.phdd.uz/api/web/BoxTypes', values, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + token
                }
            })
            .then(data => {
                if(data) {
                    getData();
                    getPagination(1)
                }
            })
            .catch(error => console.log(error));
        }
        fetchData()

        form.resetFields();

        setIsModalOpen(false);

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [checked, setChecked] = useState(false);

    const onChange = (value) => {
        setChecked(value);
    };


     ///// GET DATA /////

        useEffect(() => {
            getData()
        }, [])

        const getData = () => {
            setLoading(true);
            axios.get(`https://sherzod.phdd.uz/api/web/BoxTypes/list`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        })
        .then(data => {
            if (data) {
                setDataSource(data.data.items);
                setLoading(false);
            }
        })
        .catch(error => console.log(error));
        }

    ///// DELETE DATA /////

    const deleteData = (record) => {

        fetch(`https://sherzod.phdd.uz/api/web/BoxTypes?id=${record.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              'Authorization': "Bearer " + token
            },
            body: JSON.stringify({})
          })
          .then(data => {
            if(data) {
                getData()
                getPagination(1)
            }
        })
        .catch(error => console.log(error));
    }

    ///// UPDATE DATA /////

    const [unId, setUnId] = useState('')

    const [formUser]=Form.useForm()

    const editFunc=(id)=>{

        setUnId(id)

        axios.get(`https://sherzod.phdd.uz/api/web/BoxTypes/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        })
            .then(data => {
               formUser.setFieldsValue(data.data)
               showEditModal()
            })
            .catch(error => console.log(error));


    }

    const onEditFinish = (values) => {
        console.log('EditSuccess:', values);

            fetch(`https://sherzod.phdd.uz/api/web/BoxTypes`, {
            method: "PUT",
            headers: {
                'accept': '*/*',
                "Content-Type": "application/json",
                'Authorization': "Bearer " + token
            },
            body: JSON.stringify({...values, id:unId})
            })
            .then(data => {
                if(data) {
                    getData()
                }
            })
            .catch(error => console.log(error));

            form.resetFields();

            setIsEditModalOpen(false);
    };

    const onEditFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onEditChange = (checked) => {
        console.log(`switch to ${checked}`);
    };

    ///// SEARCH DATA /////

    const [searchVal, setSearchVal] = useState("");

    useEffect(() => {
        searchData()
    }, [searchVal])

    const searchData = () => {

        axios.get(`https://sherzod.phdd.uz/api/web/BoxTypes/list?Search=${searchVal}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
    })
        .then(data => {
            const filtered = data.data.items.filter(item => {
                return `${item.name?.toLowerCase()}`.includes(searchVal?.toLowerCase());
            })
            setDataSource(filtered)
        })
        .catch(error => console.log(error));
    }

    ///// PAGINATION /////

    useEffect(() => {
        getPagination(1)
    }, [])

    const getPagination = (page) => {
        setLoading(true);
        axios.get(`https://sherzod.phdd.uz/api/web/BoxTypes/list?Page=${page}&PageSize=10`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
    })
    .then(data => {
        setTotalPages(data.data.total_pages);
        setDataSource(data.data.items);
        setLoading(false);
    })
    .catch(error => console.log(error));
    }



    return (
        <>
            <div className='container mx-auto'>
                <div className='flex items-center justify-between my-5'>
                    <h2 className="font-bold">Тип коробки</h2>

                    <button className='bg-emerald-600 hover:bg-emerald-700 p-3 rounded text-white' onClick={showModal}>Добавить коробку</button>
                </div>

                <div>
                    <input className='rounded border-2 border-inherit p-1 w-80 my-10 search-input' type="search" placeholder='Search' value={searchVal} onChange={e=>setSearchVal(e.target.value)}/>
                </div>

                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                    pageSize: 10,
                    total: `${totalPages}0`,
                    onChange: (page) => {
                        getPagination(page);
                    },
                    }}
                ></Table>
            </div>

            <Modal title="Добавить коробку" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
                <Form
                    form={form}
                    layout="vertical"
                    className="post-modal-form mx-auto"
                    name="basic"
                    labelCol={{
                    span: 80,
                    }}
                    wrapperCol={{
                    span: 80,
                    }}
                    style={{
                        maxWidth: 600,
                        display:"flex",
                        flexDirection:"column",
                        alignItems:"center",
                        justifyContent:"center",
                        marginTop: 50,
                        padding: 20,
                        marginBottom: -100
                    }}
                    initialValues={{
                    remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                    style={{
                        marginBottom:-40,
                    }}
                    className="post-modal-form-item"
                    label="Название"
                    name="name"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your name!',
                        },
                    ]}
                    >
                    <Input style={{
                            width:350,
                        }}/>
                    </Form.Item>

                    <Form.Item
                    style={{
                        marginBottom:-40,
                    }}
                    className="post-modal-form-item"
                    label="Описaние"
                    name="description"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your description!',
                        },
                    ]}
                    >
                    <Input style={{
                            width:350,
                        }}/>
                    </Form.Item>

                    <Form.Item
                    style={{
                        marginBottom:-40,
                    }}
                    className="post-modal-form-item"
                    label="Код"
                    name="code"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your code!',
                        },
                    ]}
                    >
                    <Input style={{
                            width:350,
                        }}/>
                    </Form.Item>

                    <Form.Item style={{
                            width:350,
                            display:"flex",
                        }}
                        label="Активность" valuePropName="checked" name="is_active">
                        <Switch checked={checked} className='w-3' onChange={onChange}/>
                    </Form.Item>

                    <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                    >
                    <Button style={{
                        width: 350,
                        backgroundColor:"green",
                        color:"white",
                        border:"none",
                        marginLeft:-140,
                        marginTop:30
                    }} className="block w-full"  htmlType="submit">
                        Добавить
                    </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Изменить коробку" open={isEditModalOpen} onOk={handleEditOk} onCancel={handleEditCancel} footer={null}>
                <Form
                    form={formUser}
                    layout="vertical"
                    name="basic"
                    labelCol={{
                    span: 8,
                    }}
                    wrapperCol={{
                    span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                        display:"flex",
                        flexDirection:"column",
                        alignItems:"center",
                        justifyContent:"center",
                        marginTop: 50,
                        padding: 20,
                        marginBottom: -100
                    }}
                    initialValues={{
                    remember: true,
                    }}
                    onFinish={onEditFinish}
                    onFinishFailed={onEditFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                    style={{
                        marginBottom:-40,
                    }}
                    label="Название"
                    name="name"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your name!',
                        },
                    ]}
                    >
                    <Input style={{
                            width:350,
                        }}/>
                    </Form.Item>

                    <Form.Item
                    style={{
                        marginBottom:-40,
                    }}
                    label="Описние"
                    name="description"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your description!',
                        },
                    ]}
                    >
                    <Input style={{
                            width:350,
                        }}/>
                    </Form.Item>

                    <Form.Item
                    style={{
                        marginBottom:-40,
                    }}
                    label="Код"
                    name="code"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your code!',
                        },
                    ]}
                    >
                    <Input style={{
                            width:350,
                        }}/>
                    </Form.Item>

                    <Form.Item style={{
                            width:350,
                            display:"flex",
                        }} label="Активность" valuePropName="checked">
                        <Switch className='w-3' onChange={onEditChange}/>
                    </Form.Item>

                    <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                    >
                    <Button style={{
                        width: 350,
                        backgroundColor:"green",
                        color:"white",
                        border:"none",
                        marginLeft:-140,
                        marginTop:30}}
                        type="primary" htmlType="submit">
                        Изменить
                    </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>


    )

}

export default Home