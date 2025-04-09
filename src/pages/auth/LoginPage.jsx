import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppContext } from '@/context/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLoginMutation } from '@/queries/useAuth';
import { loginSchema } from '@/schemas/authSchema';
import { handleError } from '@/utils/utils';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, role } = useAppContext();
  const { mutateAsync: loginMutation, isLoading } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      taikhoan: '',
      matkhau: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      const { data } = await loginMutation(values);
      if (data.taikhoan) {
        login(data);
        navigate('/profile');
      }
    } catch (err) {
      handleError({ error: err, setError: setError });
    }
  };
  if (role !== null) {
    navigate('/profile');
  }
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
          <CardDescription>Trang đăng nhập của admin</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taikhoan">Tài khoản</Label>
              <Input
                id="taikhoan"
                {...register('taikhoan')}
                placeholder="Nhập tài khoản"
              />
              {errors.taikhoan && (
                <p className="text-sm text-red-500">
                  {errors.taikhoan.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="matkhau">Mật khẩu</Label>
              <Input
                id="matkhau"
                type="password"
                {...register('matkhau')}
                placeholder="Nhập mật khẩu"
              />
              {errors.matkhau && (
                <p className="text-sm text-red-500">{errors.matkhau.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
