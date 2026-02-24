'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

export default function UiKitPage() {
  const { toast } = useToast();
  const [value, setValue] = useState('one');

  return (
    <div className="container-page space-y-8 py-10">
      <div className="space-y-2">
        <h1 className="page-title">UI Kit</h1>
        <p className="text-muted-foreground">Быстрый обзор базовых компонентов.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Ваш запрос" />
          <Input type="email" placeholder="Email" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="one">План</TabsTrigger>
              <TabsTrigger value="two">Данные</TabsTrigger>
              <TabsTrigger value="three">Команда</TabsTrigger>
            </TabsList>
            <TabsContent value="one">Описание первой вкладки.</TabsContent>
            <TabsContent value="two">Описание второй вкладки.</TabsContent>
            <TabsContent value="three">Описание третьей вкладки.</TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dialog</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Открыть модал</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новый подбор</DialogTitle>
                <DialogDescription>Добавьте описание и сохраните.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Название" />
                <Input placeholder="Описание" />
                <Button>Сохранить</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Toast</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() =>
              toast({
                title: 'Уведомление',
                description: 'Компоненты готовы к кастомизации.'
              })
            }
          >
            Показать toast
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


