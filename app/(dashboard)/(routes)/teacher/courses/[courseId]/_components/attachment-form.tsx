"use client";
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course;
  courseId: string;
}
const formSchema = z.object({
  url: z.string().min(1).optional(),
});
export default function AttachmentForm({
  courseId,
  initialData,
}: AttachmentFormProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>();
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, data);
      toast.success("更新成功");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("发生错误");
    }
  };

  const onDelete = async (attachmentId: string) => {
    try {
      setDeletingId(attachmentId);
      await axios.delete(
        `/api/courses/${courseId}/attachments/${attachmentId}`
      );
      toast.success("删除成功");
      router.refresh();
    } catch (error) {
      toast.error("发生错误");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-stone-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        课程附件
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>取消添加</>}
          {!isEditing && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              添加附件
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData?.attachments.length === 0 ? (
            <p className="text-sm mt-2 text-slate-500 italic">暂无附件</p>
          ) : (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100"
                >
                  <File className="h-4 w-4 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader className="w-4 h-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      className="ml-auto hover:opacity-75 transition"
                      onClick={() => onDelete(attachment.id)}
                    >
                      <X className="w-4 h-4 " />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                handleSubmit({ url: url });
              }
            }}
          ></FileUpload>
          <div className="text-xs text-muted-foreground mt-4">
            可上传多个附件
          </div>
        </div>
      )}
    </div>
  );
}
