import LoginForm from "@/features/auth/login";
import RegisterForm from "@/features/auth/register";
import AuthCard from "@/shared/ui/auth/AuthCard";
import AuthLayout from "@/shared/ui/auth/AuthLayout";

interface AuthPageProps {
    variant: 'login' | 'register';
}

const AuthPage = ({ variant = 'login' }: AuthPageProps) => {
    return (
        <AuthLayout heading={variant === 'register' ? "Регистрация" : "Авторизация"}>
            <AuthCard>
                {variant === 'register' ? <RegisterForm /> : <LoginForm />}
            </AuthCard>
        </AuthLayout>
    );
};

export default AuthPage;