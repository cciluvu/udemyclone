"use client";
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}
const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "请上传封面" }).optional(),
});
export default function ImageForm({ courseId, initialData }: ImageFormProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, data);
      toast.success("更新成功");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("发生错误");
    }
  };

  return (
    <div className="mt-6 border bg-stone-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        课程封面
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>取消修改</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              上传封面
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              修改封面
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-gray-500"></ImageIcon>
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            ></Image>
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImageUploader"
            onChange={(url) => {
              if (url) {
                handleSubmit({ imageUrl: url });
              }
            }}
          ></FileUpload>
          <div className="text-xs text-muted-foreground mt-4">
            推荐16:9比例图片
          </div>
        </div>
      )}
    </div>
  );
}
