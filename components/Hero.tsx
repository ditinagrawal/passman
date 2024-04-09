import { useEffect, useState } from "react";
import axios from "axios";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
    Card,
    CardContent,
    CardFooter
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from '@clerk/nextjs';
import { Eye, FilePenLine, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Hero = () => {
    const { user, isLoaded } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [title, setTitle] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwords, setPasswords] = useState<any[]>([])
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const getPasswords = async () => {
        try {
            const res = await axios.get("/api/passwords");
            setPasswords(res.data);
        } catch (error) {
            toast.error("Error fetching passwords");
            console.error(error);
        }
    }

    const setFormEmpty = () => {
        setTitle("");
        setUsername("");
        setPassword("");
        setNewUsername("");
        setNewPassword("");
    }

    const handleSave = async () => {
        try {
            if (!title || !username || !password) {
                setFormEmpty();
                return toast.error("Missing Required Fields");
            }
            const email = user?.emailAddresses[0].emailAddress;
            await axios.post("/api/passwords", { email, title, username, password });
            toast.success("Password saved successfully");
            setFormEmpty();
            getPasswords();
        } catch (error) {
            console.error(error);
        }
    }

    const handleUpdate = async (id: any) => {
        try {
            if (!id) return toast.error("Missing Id");
            const email = user?.emailAddresses[0].emailAddress;
            await axios.patch(`/api/passwords`, { id, email, username: newUsername, password: newPassword });
            toast.success("Password updated successfully");
            setFormEmpty();
            getPasswords();
        } catch (error) {
            console.error(error);
        }
    }

    const deletePassword = async (id: any) => {
        try {
            if (!id) return toast.error("Missing Id");
            await axios.delete(`/api/passwords?id=${id}`);
            toast.success("Password deleted successfully");
            getPasswords();
        } catch (error) {
            toast.error("Error deleting password");
            console.error(error);
        }
    }

    useEffect(() => {
        getPasswords();
    }, [])

    if (!isLoaded) return (
        <div className="h-[80vh] scale-150 flex items-center justify-center">
            <Loader2 className="animate-spin" />
        </div>
    );

    return (
        <section className='container py-6 w-full'>
            <div className='mt-12 font-mono'>
                <h2 className='text-5xl mb-1'>Welcome, <span className='font-semibold'>{user?.firstName} 👋</span></h2>
                <p>Save your passwords like a pro 😎 <br />with <span className='font-bold'>passman</span></p>
            </div>
            <div className='mt-8'>
                <AlertDialog>
                    <AlertDialogTrigger className='bg-primary px-4 py-2 text-white rounded-md'>Save a new password</AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Save a new password</AlertDialogTitle>
                            <AlertDialogDescription>
                                we save your password with encryption, so that no one can see it except you.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Card>
                            <CardContent>
                                <form className="mt-4">
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="title">Title</Label>
                                            <Input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="Enter title here" />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="username">Username</Label>
                                            <Input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="Enter username here" />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="password">Password</Label>
                                            <Input value={password} onChange={e => setPassword(e.target.value)} type="password"
                                                placeholder="Enter password here" />
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <AlertDialogCancel onClick={setFormEmpty}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleSave}>Continue</AlertDialogAction>
                            </CardFooter>
                        </Card>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <div className="mt-8">
                <Table>
                    <TableCaption>A list of your recent saved passwords.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead className="flex items-center">
                                Password<Eye className="cursor-pointer ms-2" onClick={() => setShowPassword(!showPassword)} />
                            </TableHead>
                            <TableHead><FilePenLine />Edit</TableHead>
                            <TableHead><Trash2 />Drop</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {passwords.map(({ password }) => {
                            return (
                                <>
                                    {password.email === user?.emailAddresses[0].emailAddress ? (
                                        <TableRow key={password._id}>
                                            <TableCell className="font-medium">{password.title}</TableCell>
                                            <TableCell>{password.username}</TableCell>
                                            <TableCell>
                                                <input className="bg-transparent" disabled type={showPassword ? "text" : "password"} value={password.password} />
                                            </TableCell>
                                            <TableCell>
                                                <AlertDialog>
                                                    <AlertDialogTrigger><FilePenLine /></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Update your password</AlertDialogTitle>
                                                        </AlertDialogHeader>
                                                        <Card>
                                                            <CardContent>
                                                                <form className="mt-4">
                                                                    <div className="grid w-full items-center gap-4">
                                                                        <div className="flex flex-col space-y-1.5">
                                                                            <Label htmlFor="title">Title</Label>
                                                                            <Input value={password.title} disabled type="text" placeholder="Enter title here" />
                                                                        </div>
                                                                        <div className="flex flex-col space-y-1.5">
                                                                            <Label htmlFor="username">Username</Label>
                                                                            <Input value={newUsername} onChange={e => setNewUsername(e.target.value)} type="text" placeholder="Enter username here" />
                                                                        </div>
                                                                        <div className="flex flex-col space-y-1.5">
                                                                            <Label htmlFor="password">Password</Label>
                                                                            <Input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password"
                                                                                placeholder="Enter password here" />
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </CardContent>
                                                            <CardFooter className="flex justify-between">
                                                                <AlertDialogCancel onClick={setFormEmpty}>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleUpdate(password._id)}>Continue</AlertDialogAction>
                                                            </CardFooter>
                                                        </Card>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                            <TableCell>
                                                <Trash2 className="cursor-pointer" onClick={() => { deletePassword(password._id) }} />
                                            </TableCell>
                                        </TableRow>
                                    ) : (<> </>)}
                                </>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </section>
    )
}

export default Hero