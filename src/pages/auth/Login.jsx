import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        userId: '',
        password: '',
    });

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const onLogin = async () => {
        if (!form.userId || !form.userPw) {
            toast.error("아이디와 비밀번호를 입력해주세요.");
            return;
        }
        
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                      userId: form.userId
                    , userPw: form.userPw
                }),
            });

            if (!response.ok) {
                toast.error("아이디 또는 비밀번호가 올바르지 않습니다");
                return;
            }

            const data = await response.json();

            // ✅ 로그인 성공 시에만 저장
            sessionStorage.setItem(
                "loginUser",
                JSON.stringify({
                      userId: data.USER_ID
                    , userName: data.USER_NM
                    , userTp: data.USER_TP
                })
            );

            navigate("/");
        } catch (error) {
            alert("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">

                {/* 로고 / 타이틀 */}
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                            W
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Sign in
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Mini WMS 시스템에 접속하세요
                    </p>
                </div>

                {/* 입력 영역 */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            User ID
                        </label>
                        <input
                            type="text"
                            name="userId"
                            placeholder="아이디를 입력하세요"
                            value={form.userId}
                            onChange={onChange}
                            className="
                w-full
                h-11
                px-3
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:border-indigo-500
              "
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="userPw"
                            placeholder="비밀번호를 입력하세요"
                            value={form.userPw}
                            onChange={onChange}
                            className="
                w-full
                h-11
                px-3
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:border-indigo-500
              "
                        />
                    </div>
                </div>

                {/* 로그인 버튼 */}
                <button
                    onClick={onLogin}
                    className="
            mt-6
            w-full
            h-11
            bg-indigo-600
            text-white
            font-semibold
            rounded-lg
            hover:bg-indigo-700
            transition
          "
                >
                    Login
                </button>

                {/* 하단 문구 */}
                <div className="mt-6 text-center text-xs text-gray-400">
                    © Mini WMS Project
                </div>
            </div>
        </div>
    );
}

export default Login;
