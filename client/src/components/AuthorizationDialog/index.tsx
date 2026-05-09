import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound } from "lucide-react";

interface Props {
    onClose: () => void
}

const AuthorizationPopup = ({ onClose }: Props) => {
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
                    <DialogTitle>Authentication</DialogTitle>
                </div>
                <DialogDescription>
                    Please enter your Minecraft API token to continue.
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
                        Your token will be stored securely in your browser.
                    </p>
                </div>
            </div>

            <DialogFooter>
                <Button className='w-1/2' variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button 
                    className='w-1/2'
                    onClick={() => handleSubmit(token)} 
                    disabled={!token.trim()}
                >
                    Confirm
                </Button>
            </DialogFooter>
        </>
    )
}

export default AuthorizationPopup;