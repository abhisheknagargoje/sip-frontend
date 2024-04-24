import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default async function StudentPage({
  params,
}: {
  params: { studentId: string };
}) {
  const studentId = params.studentId;
  const baseUrl = process.env.API_BASE_URL;
  const url = `${baseUrl}/student/${studentId}`;
  const response = await axios.get(url);
  const student = response.data.data;

  console.log(student);
  console.log(url);
  return (
    <div className=" h-screen flex-col">
      <div className="bg-slate-200 justify-center content-center items-center flex m-2">
        <div className="m-10">
          <h1 className="justify-center content-center items-center flex ">
            Name of the Student {student.fullName}
          </h1>
        </div>
      </div>
      <div className="flex flex-row gap-3">
        <div className="bg-slate-100 w-1/2 h-screen m-2">
          <h1 className="m-10 font-medium">Email id: {student.email}</h1>
          <h1 className="m-10 font-medium">Roll Number : {student.rollNo}</h1>
          <h1 className="m-10 font-medium">
            Mobile Number : {student.mobileNo}
          </h1>
          <h1 className="m-10 font-medium">PRN Number : {student.prnNo}</h1>
          <h1 className="m-10 font-medium">
            Registration Number : {student.registrationId}
          </h1>
        </div>
        <div className="bg-slate-100 w-1/2 h-screen m-2 flex flex-col gap-5">
          <div className="bg-slate-200 m-10 p-6">
            <div className="flex flex-row space-x-56">
              <h1 className="m-2 font-medium">Internship Details</h1>
              <DropdownMenu>
                <DropdownMenuTrigger className="h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-xl">
                  Open
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Internship</DropdownMenuItem>
                  <DropdownMenuItem>Internship</DropdownMenuItem>
                  <DropdownMenuItem>Internship</DropdownMenuItem>
                  <DropdownMenuItem>Internship</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="bg-slate-200 m-10 p-6">
            <div className="flex flex-row space-x-56">
              <h1 className="m-2 font-medium">Seminar Details</h1>
              <DropdownMenu>
                <DropdownMenuTrigger className="h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-xl">
                  Open
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Internship</DropdownMenuItem>
                  <DropdownMenuItem>Internship</DropdownMenuItem>
                  <DropdownMenuItem>Internship</DropdownMenuItem>
                  <DropdownMenuItem>Internship</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
