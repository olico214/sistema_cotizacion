import { toast } from "sonner"

export const emailSend = async () => {
    toast.success("Correo Enviado", {
        duration: 2000
    })

}

export const whatsappSend = async () => {
    toast.success("Mensaje Enviado", {
        duration: 2000
    })
}

export const pdfExportado = async () => {
    toast.success("PDF creado con exito", {
        duration: 2000
    })
}
