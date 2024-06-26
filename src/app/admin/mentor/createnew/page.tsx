"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCookie } from "cookies-next";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    registrationId: "",
    mobileNo: "",

    // Add more fields if needed
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const adminCookies = getCookie("Admin");
    if (!adminCookies) {
      console.error("Admin cookie not found");
      return;
    }
    console.log(adminCookies);

    const { accessToken } = JSON.parse(adminCookies);
    console.log(accessToken);
    console.log(formData);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // credentials: "include",
    };
    try {
      const response = await fetch(
        "https://sip-backend-api.onrender.com/api/v1/admin/registerMentor",
        {
          method: "POST",
          headers: headers,

          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        console.log("Profile added successfully");
        toast.success("Profile added successfully");
        setFormData({
          fullName: "",
          username: "",
          email: "",
          registrationId: "",
          mobileNo: "",
        });
      } else {
        console.error("Error Adding  profile:", response.statusText);
        toast.error("Error Adding  profile");
        // Handle error
      }
    } catch (error) {
      console.error("Error occurred while creating  profile:", error);
      toast.error("Error occurred while creating  profile");
    }
  };
  const router = useRouter();

  return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="w-full max-w-screen-lg mx-auto">
        <div>
          <div className="bg-white rounded shadow-xl p-4 px-4 md:p-8 mb-6">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="text-gray-600">
                <p className="font-medium text-lg">Mentor Personal Details</p>
                <p>Fill out all the fields.</p>
              </div>
              <form onSubmit={submitHandler}>
                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                      <label htmlFor="full_name">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="username">User Name</label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="email">Email</label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="md:col-span-5">
                      <label htmlFor="registrationId">Registration Id</label>
                      <input
                        type="text"
                        name="registrationId"
                        id="registrationId"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={formData.registrationId}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="mobileNo">Mobile No</label>
                      <input
                        type="number"
                        name="mobileNo"
                        id="mobileNo"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={formData.mobileNo}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Other form fields... */}
                  </div>
                </div>
                <div className="lg:col-span-3 flex justify-end">
                  <Button
                    type="submit"
                    className="flex m-4 p-4 bg-black text-white rounded-md"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <Button onClick={() => router.back()}>Go back</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
