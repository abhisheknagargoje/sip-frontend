"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
interface Criteria {
  name: string;
  criteriaMarks: string;
  evalType: string;
  academicYear: string;
  id: string;
}
const Page = () => {
  const [data, setData] = useState<Criteria[]>([]);
  const [response, setResponse] = useState<any>([]);

  const [ayear, setAyear] = useState("2023-2024");
  const [criterias, setCriterias] = useState({
    criteriaName: "",
    criteriaMarks: "",
    academicYear: "",
  });

  const [open, setOpen] = useState(false);
  const [openN, setOpenN] = useState(false);
  const [maxMarks, setMaxMarks] = useState(0);
  const fetchData = async () => {
    const adminCookies = getCookie("Admin");
    if (!adminCookies) {
      console.error("Admin cookie not found");
      return;
    }
    console.log(adminCookies);

    const { accessToken } = JSON.parse(adminCookies);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await fetch(
      `https://sip-backend-api.onrender.com/api/v1/admin/evaluation/internshipCriteria?academicYear=${ayear}`,
      {
        headers: headers,
        method: "GET",
      }
    );
    const resData = await response.json();

    if (!resData.success) {
      throw new Error("Failed to fetch data");
    }
    setResponse(resData.data);
    setMaxMarks(resData.data.totalMaxMarks);
    setData(
      resData.data.criterias.map((item: any) => ({
        name: item.name,
        criteriaMarks: item.criteriaMarks,
        evalType: item.evalType,
        academicYear: item.academicYear,
        id: item._id,
      }))
    );
  };

  useEffect(() => {
    fetchData(); // Call fetchData function
  }, [ayear, criterias]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCriterias((prevState) => ({
      ...prevState,
      academicYear: ayear,
      [name]: value,
    }));
  };

  const handleDelete = async (itemId: string) => {
    console.log(itemId); // Log the item ID to verify it's correct

    try {
      const adminCookies = getCookie("Admin");
      if (!adminCookies) {
        console.error("Admin cookie not found");
        return;
      }
      const { accessToken } = JSON.parse(adminCookies);

      const deleteres = await fetch(
        `https://sip-backend-api.onrender.com/api/v1/admin/evaluation/internshipCriteria/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (deleteres.ok) {
        console.log("Criteria deleted successfully");
        toast.success("Criteria deleted successfully");
        setData(data.filter((item) => item.id !== itemId));
        setCriterias({
          criteriaName: "",
          criteriaMarks: "",
          academicYear: "",
        });
        // Update the data after successful deletion if required
      } else {
        console.error("Error deleting criteria:", deleteres.statusText);
        toast.error("Error deleting criteria");
      }
    } catch (error) {
      console.error("Error occurred while deleting criteria:", error);
      toast.error("Error occurred while deleting criteria");
      // Handle any network or other errors that may occur during deletion
    }
  };

  const handleSave = async (event: any) => {
    event.preventDefault();
    // Define functionality to save criteria
    console.log(criterias);
    const adminCookies = getCookie("Admin");
    if (!adminCookies) {
      console.error("Admin cookie not found");
      return;
    }
    console.log(adminCookies);
    const { accessToken } = JSON.parse(adminCookies);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // credentials: "include",
    };
    try {
      const response = await fetch(
        "https://sip-backend-api.onrender.com/api/v1/admin/evaluation/internshipCriteria",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(criterias),
        }
      );
      if (response.ok) {
        fetchData();
        console.log("criteria added successfully");
        toast.success("criteria added successfully");
      } else {
        console.error("Error Adding  criteria:", response.statusText);
        // Handle error
      }
      setOpen(false);
    } catch (error: any) {
      console.error("Error occurred while creating  profile:", error);
      toast.error(error);
    }
  };

  const handleChangeMaxMarks = (e: any) => {
    const { value } = e.target;
    setMaxMarks(Number(value));
  };
  const handleSaveMaxMarks = async (event: any) => {
    event.preventDefault();
    const adminCookies = getCookie("Admin");
    if (!adminCookies) {
      console.error("Admin cookie not found");
      return;
    }
    console.log(adminCookies);
    const { accessToken } = JSON.parse(adminCookies);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // credentials: "include",
    };
    const requsr = {
      evalType: "internship",
      marks: maxMarks,
      academicYear: ayear,
    };
    try {
      const response = await fetch(
        "https://sip-backend-api.onrender.com/api/v1/admin/evaluation/totalMarks",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(requsr),
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        // Assuming responseData contains { marks: number }
        fetchData();
        setMaxMarks(responseData.data.marks);
        console.log(responseData.data.marks);
        console.log("Total Marks Updated successfully");
        toast.success("Total Marks Updated successfully");
      } else {
        const errorData = await response.json();
        console.error(
          "Error Updating Total Marks:",
          errorData // or response.statusText
        );
        // Handle error
      }
      setOpenN(false);
    } catch (error: any) {
      console.error("Error occurred while Updating Total Marks:", error);
      toast.error(error.message);
    }
  };
  const router = useRouter();
  return (
    <div className="container mx-auto p-4 ">
      <div className="flex flex-col lg:flex-row lg:justify-start">
        <div className="mb-2 m-5 lg:mb-0 lg:mr-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{ayear || "YEAR"}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>ACADEMIC YEAR</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={ayear}
                onValueChange={(value) => {
                  setAyear(value);
                }}
              >
                {/* <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem> */}
                <DropdownMenuRadioItem value="2022-2023">
                  2022-2023
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="2023-2024">
                  2023-2024
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mb-2 m-5">
          <div className="flex items-center border-2 justify-center h-auto rounded-md gap-3 p-2">
            <div className="bg-red-500 rounded-md p-0.5 mr-2">
              <span className="text-white">IMP</span>
            </div>
            <h3 className="text-md">Total Marks that can be allocated :</h3>
            <p className="text-md font-bold">{response.totalMaxMarks}</p>
          </div>
        </div>
        <div className="mb-2 m-5">
          <Dialog open={openN} onOpenChange={setOpenN}>
            <DialogTrigger asChild>
              <Button variant="outline">Update Total Marks</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Total Marks</DialogTitle>
                <DialogDescription>
                  {/* Add new Criteria Details. Click save when you're done. */}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalMarks" className="text-right">
                    Total Marks
                  </Label>
                  <Input
                    id="totalMarks"
                    name="totalMarks"
                    value={maxMarks}
                    onChange={handleChangeMaxMarks}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveMaxMarks}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 m-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {data.map((item: any) => (
          <Card key={item.id} className="flex-grow relative">
            <div className="relative">
              <div className="absolute top-1 right-0 p-2" aria-label="Delete">
                <div className="bg-red-500 rounded-full p-1">
                  <MdDelete
                    className="w-5 h-5 cursor-pointer text-white"
                    onClick={() => handleDelete(item.id)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
            </div>
            <CardContent>
              <p>{item.criteriaMarks}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="m-5">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add New Criteria</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Internship Criteria</DialogTitle>
              <DialogDescription>
                Add new Criteria Details. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="criteriaName" className="text-right">
                  Criteria Name
                </Label>
                <Input
                  id="criteriaName"
                  name="criteriaName"
                  value={criterias.criteriaName}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="criteriaMarks" className="text-right">
                  Criteria Marks
                </Label>
                <Input
                  id="criteriaMarks"
                  name="criteriaMarks"
                  value={criterias.criteriaMarks}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* <Button className="m-4 bg-red-500">Delete Criteria</Button> */}
      </div>
      <div className="m-5">
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    </div>
  );
};

export default Page;
