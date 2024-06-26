// Profile.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMentor,
  setMentor,
  updateProfile,
} from "../../../features/username/Slice";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import axios from "axios";

interface ProfileData {
  name: string;
  username: string;
  email: string;
  mobileNo: string;
}

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const mentor = useSelector(selectMentor);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [number, setNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [popen, setPOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<any>(null);

  const [profileopen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (mentor) {
      setName(mentor.fullName);
      setUsername(mentor.username);
      setNumber(mentor.mobileNo);
    }
  }, [mentor]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(event.target.value);
  };
  const handleOpassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value);
  };
  const handleNpassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const submitProfileHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const updatedData = {
      ...mentor,
      username: username,
      fullName: name,
      mobileNo: number,

      // email: "mentor_test@example.com",
      // mobileNo: "1234567890",
      // avatar: "https://example.com/avatar.jpg",
    };

    try {
      const mentorCookie = getCookie("Mentor");
      if (!mentorCookie) {
        console.error("Mentor cookie not found");
        return;
      }
      console.log(mentorCookie);

      const { accessToken } = JSON.parse(mentorCookie);
      console.log(accessToken);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        credentials: "include",
      };

      const response = await fetch(
        "https://sip-backend-api.onrender.com/api/v1/mentor/updateAccountDetails",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        console.log("Profile updated successfully");
        // Dispatch action to update profile in Redux store
        dispatch(setMentor(updatedData)); // Dispatch here
        toast.success("Profile updated successfully");
        setName("");
        setUsername("");
        setNumber("");
        setOpen(false);
      } else {
        console.error("Error updating profile:", response.statusText);
        // Handle error
      }
    } catch (error) {
      console.error("Error occurred while updating profile:", error);
      // Handle error
    }
  };

  const submitPassHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatepass = {
      newPassword: newPassword,
      oldPassword: oldPassword,
    };
    try {
      const mentorCookie = getCookie("Mentor");
      if (!mentorCookie) {
        console.error("Mentor cookie not found");
        return;
      }

      const { accessToken } = JSON.parse(mentorCookie);
      console.log(accessToken);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await fetch(
        "https://sip-backend-api.onrender.com/api/v1/mentor/changePassword",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(updatepass),
        }
      );
      if (response.ok) {
        console.log("Password updated successfully");
        // Optionally, you can clear the password fields after a successful update
        setNewPassword("");
        setOldPassword("");
        toast.success("Password updated successfully");
        setPOpen(false);
      } else {
        console.error("Error updating password:", response.statusText);
        // Handle error
      }
    } catch (error) {
      console.error("Error occurred while updating password:", error);
      // Handle error
    }
  };
  const handleSubmitPhoto = (event: any) => {
    event.preventDefault();
    const mentorCookie = getCookie("Mentor");
    if (!mentorCookie) {
      console.error("Mentor cookie not found");
      return;
    }

    const { mentor, accessToken } = JSON.parse(mentorCookie);

    if (!mentor || !mentor._id) {
      console.error("Mentor ID not found in cookie");
      return;
    }
    const url =
      "https://sip-backend-api.onrender.com/api/v1/mentor/changeAvatar";
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(url, formData, config)
      .then((response) => {
        toast.success(response.data.message); // Access the message from the response object
        setProfileOpen(false);
        setSelectedFile(null);
        dispatch(setMentor(response.data.data));
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response) {
          // Server responded with a status code outside of 2xx range
          toast.error(error.response.data.message || "An error occurred"); // Display error message from the server response
          console.log(error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          toast.error("No response received from the server");
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error("An unexpected error occurred");
          console.log("Error", error.message);
        }
      });
  };
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    console.log(file);
    setSelectedFile(file);
  };

  return (
    <div className="m-12">
      <Card className="bg-white rounded-md shadow-md hover:shadow-2xl transition duration-300 ease-in-out">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 items-center">
          <div className="flex justify-center mb-4 sm:mb-0">
            <CardHeader className="w-48 h-48 rounded-full overflow-hidden">
              <Image
                src={mentor?.avatar || "./noavatar.png"}
                alt="No Avatar"
                width={128}
                height={128}
                layout="responsive"
              />
            </CardHeader>
          </div>
          <div className="space-y-4 text-center sm:text-left">
            {mentor && (
              <form className="space-y-3">
                <div className="flex flex-col items-center sm:items-start">
                  <Label htmlFor="name" className="font-bold">
                    Name
                  </Label>
                  <p>{mentor.fullName}</p>
                </div>

                <div className="flex flex-col items-center sm:items-start">
                  <Label htmlFor="username" className="font-bold">
                    Username
                  </Label>
                  <p>{mentor.username}</p>
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <Label htmlFor="email" className="font-bold">
                    Email
                  </Label>
                  <p>{mentor.email}</p>
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <Label htmlFor="mobileNo" className="font-bold">
                    Mobile Number
                  </Label>
                  <p>{mentor.mobileNo}</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="m-4 p-4 bg-black text-white rounded-md ">
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form onSubmit={submitProfileHandler}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={username}
                  onChange={handleUsernameChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Number
                </Label>
                <Input
                  id="number"
                  name="number"
                  value={number}
                  onChange={handleNumberChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={popen} onOpenChange={setPOpen}>
        <DialogTrigger asChild>
          <Button className="m-4 p-4 bg-black text-white rounded-md ">
            Change Password
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form onSubmit={submitPassHandler}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Old Password
                </Label>
                <Input
                  id="opassword"
                  name="opassword"
                  value={oldPassword}
                  onChange={handleOpassChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  New Password
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={newPassword}
                  onChange={handleNpassChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={profileopen} onOpenChange={setProfileOpen}>
        <DialogTrigger>
          <Button className="m-4 p-4 bg-black text-white rounded-md ">
            Change Avatar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add your Profile Photo</DialogTitle>
            <DialogDescription>
              {/* This action cannot be undone. This will permanently delete your
              account and remove your data from our servers. */}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPhoto}>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {selectedFile && (
              <div className="flex flex-col items-center">
                <p className="p-2 m-2">Selected File: {selectedFile.name}</p>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected"
                  style={{ maxWidth: "50%" }}
                />
              </div>
            )}
            <DialogFooter className="p-5">
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
