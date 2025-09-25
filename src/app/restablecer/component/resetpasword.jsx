"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardBody, CardFooter, Spinner } from "@nextui-org/react";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Un componente interno para poder usar useSearchParams dentro de <Suspense>
function ResetPasswordForm() {
    const route = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("No se encontró un token en la URL. El enlace puede ser inválido.");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validaciones del lado del cliente
        if (!password || !confirmPassword) {
            setError("Por favor, completa ambos campos.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        if (!token) {
            setError("No hay un token válido para procesar la solicitud.");
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/auth/restablecer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token, nuevaContraseña: password }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Ocurrió un error inesperado.');
            }

            setSuccess("¡Tu contraseña ha sido cambiada con éxito! Ya puedes iniciar sesión.");
            toast.success("Contraseña cambiada exitosamente.");
            setPassword('');
            setConfirmPassword('');

            route.push("/")
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <Card className="max-w-md mx-auto mt-10 p-4">
                <CardHeader><h1 className="text-2xl font-bold text-green-600">¡Éxito!</h1></CardHeader>
                <CardBody><p>{success}</p></CardBody>
            </Card>
        );
    }

    return (
        <Card className="max-w-md mx-auto mt-10">
            <CardHeader>
                <h1 className="text-2xl font-bold">Restablecer Contraseña</h1>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardBody className="flex flex-col gap-4">
                    <p>Introduce tu nueva contraseña a continuación.</p>
                    <Input
                        label="Nueva Contraseña"
                        type={isVisible ? "text" : "password"}
                        variant="bordered"
                        value={password}
                        onValueChange={setPassword}
                        placeholder="Debe tener al menos 8 caracteres"
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={() => setIsVisible(!isVisible)}>
                                {isVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        }
                        isDisabled={isLoading || !token}
                    />
                    <Input
                        label="Confirmar Nueva Contraseña"
                        type={isVisible ? "text" : "password"}
                        variant="bordered"
                        value={confirmPassword}
                        onValueChange={setConfirmPassword}
                        placeholder="Repite la contraseña"
                        isDisabled={isLoading || !token}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </CardBody>
                <CardFooter>
                    <Button
                        type="submit"
                        color="primary"
                        className="w-full"
                        isLoading={isLoading}
                        isDisabled={isLoading || !token}
                    >
                        {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}


// La página principal exportada usa Suspense para manejar la carga de los parámetros de búsqueda
export default function RestablecerPage() {
    return (
        <Suspense fallback={<div className='flex justify-center items-center h-screen'><Spinner label="Cargando..." /></div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}