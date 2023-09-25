import "./login.css";
import React from 'react';
import { Button, Form, Input } from 'antd';
import axios from 'axios';

const Login = () => {

    const onFinish = (values) => {
        console.log('Success:', values);

        const fetchData = () => {
            axios.post('https://sherzod.phdd.uz/api/web/Tokens', values)
            .then(({data}) => {
                if (data.token) {
                    window.localStorage.setItem("token", data.token);

                    window.location = "/"
                }
            })
            .catch(error => console.log(error));
        }
        fetchData()
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <div className='login-page'>
            <div className='containera'>
                <div className='wrapper'>
                    <h2 className="text-center font-bold">Login</h2>

                    <Form
                        layout="vertical"
                        name="basic"
                        labelCol={{
                            span: 80,
                        }}
                        wrapperCol={{
                            span: 160,
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
                        label="Username"
                        name="login"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                    ]}
                    >
                        <Input style={{
                            width:300,
                        }}/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                    ]}
                    >
                        <Input.Password style={{
                            width:300,
                        }}/>
                    </Form.Item>

                    <Form.Item

                        wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                    >
                        <Button style={{
                            width:300,
                            backgroundColor: "black",
                            color: "white",
                            border:"none",
                            marginLeft: -120,
                            marginTop: -40
                        }}
                            htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Login