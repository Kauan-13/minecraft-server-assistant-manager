import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound } from "lucide-react";

interface Props {
    onClose: () => void
}

const AuthorizationDialog = ({ onClose }: Props) => {
    const [ token, setToken ] = useState(localStorage.getItem('minecraft-api-token') || '');

    const handleSubmit = (token: string) => {
        localStorage.setItem('minecraft-api-token', token);
        onClose();
    }

    return (
        <>
            <DialogHeader>
                <div className="flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-muted-foreground" />
                    <DialogTitle>Autenticação</DialogTitle>
                </div>
                <DialogDescription>
                    Por favor, insira o token da API para continuar.
                </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="tokenInput">
                        Token <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="tokenInput"
                        type="text"
                        placeholder="Enter your token..."
                        value={ token }
                        onChange={ (event) => setToken(event.target.value) }
                        onKeyDown={
                            (e) => {
                                if (e.key === 'Enter' && token.trim())
                                    handleSubmit(token);
                            }
                        }
                        autoFocus
                    />
                    <p className="text-xs text-muted-foreground">
                        Seu token será armazenado com segurança no seu browser.
                    </p>
                </div>
            </div>

            <DialogFooter>
                <Button className='w-1/2' variant="outline" onClick={onClose}>
                    Cancelar
                </Button>
                <Button 
                    className='w-1/2'
                    onClick={() => handleSubmit(token)} 
                    disabled={!token.trim()}
                >
                    Confirmar
                </Button>
            </DialogFooter>
        </>
    )
}

export default AuthorizationDialog;