"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
const formSchema = z.object({
  title: z.string().min(1, { message: "需要填写标题" }),
});
const CreatePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const router = useRouter();

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", data);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("创建课程成功");
    } catch (e) {
      toast.error("创建课程失败");
    }
  };

  return (
    <div className="max-w-md mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">命名课程</h1>
        <p>请填写课程内容,稍后可以修改</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标题</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="请输入标题"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>标题不能为空,最多100个字符</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/teacher/courses">
                <Button type="button" variant="secondary">
                  取消
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                继续
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
