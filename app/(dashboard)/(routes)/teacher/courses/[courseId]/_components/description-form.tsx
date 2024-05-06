"use client";
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}
const formSchema = z.object({
  description: z.string().min(1, { message: "描述可选" }).optional(),
});
export default function DescriptionForm({
  courseId,
  initialData,
}: DescriptionFormProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { description: initialData?.description || "" },
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting, isValid } = form.formState;

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
        课程描述
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>取消</>}
          {!isEditing && (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              编辑
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-gray-500 italic"
          )}
        >
          {initialData.description || "暂无描述"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      {...field}
                      placeholder="请输入课程描述"
                    ></Textarea>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                保存
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
