import React, { useState } from "react";
import UserLogo from "../assets/Profile.jpg";
import Button from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/authSlice";
import { Loader2, X } from "lucide-react";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    name: user?.name || "",
    description: user?.description || "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const changeEventHendler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    if (input?.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      const res = await axios.put(
        "http://localhost:8000/api/v1/user/profile/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setOpen(false);
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 py-12 px-4 lg:px-0 min-h-screen">
      <div className="max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-45">
        {" "}
        <div className="flex flex-col items-center md:flex-row md:items-start space-y-8 md:space-y-0 md:space-x-12">
          {/* profile picture */}
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
            <img
              src={user?.photoUrl || UserLogo}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {/* user info */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-blue-500">
              Welcome, {user?.name?.split(" ")[0] || "User"}
            </h1>
            <p className="text-lg text-gray-600 mt-3">
              <span className="font-bold">Email: </span>
              {user?.email || "Email not available"}
            </p>
            <p className="text-gray-600 my-1 capitalize">
              <span className="font-bold">Role: </span> {user?.role}
            </p>
            <p className="text-gray-700 text-base leading-relaxed mb-3">
              <span className="font-bold">Bio: </span>
              {user?.description || "Add your bio"}
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <Button
                onClick={() => setOpen(true)}
                className="text-white bg-blue-500 hover:bg-blue-600"
              >
                Edit Profile
              </Button>

              <DialogContent className="sm:max-w-[425px] bg-white">
                {" "}
                {/* ✅ تأكد من bg-white هنا أيضاً */}
                <DialogHeader>
                  <DialogTitle className="text-center text-gray-800">
                    {" "}
                    {/* ✅ لون نص داكن */}
                    Edit Profile
                  </DialogTitle>
                  <DialogDescription className="text-center text-gray-600">
                    {" "}
                    {/* ✅ لون نص متوسط */}
                    Make changes to your profile here.
                  </DialogDescription>
                </DialogHeader>
                {/* زر الإغلاق (X) في الزاوية */}
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogClose>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-gray-700">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={input.name}
                      onChange={changeEventHendler}
                      className="col-span-3 text-gray-700 bg-white border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="description"
                      className="text-right text-gray-700"
                    >
                      Description
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      value={input.description}
                      onChange={changeEventHendler}
                      className="col-span-3 text-gray-700 bg-white border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="file" className="text-right text-gray-700">
                      Picture
                    </Label>
                    <Input
                      id="file"
                      name="file"
                      type={"file"}
                      accept="image/*"
                      onChange={changeFileHandler}
                      className="w-[277px] bg-white text-gray-700"
                    />
                  </div>
                </div>
                <DialogFooter>
                  {loading ? (
                    <Button className="bg-blue-400 text-white" disabled>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Please Wait
                    </Button>
                  ) : (
                    <Button
                      className="text-white bg-blue-500 hover:bg-blue-600"
                      onClick={submitHandler}
                    >
                      Save Changes
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
