'use client'

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../Components/card";
import Button from "../Utils/Button";
import Input from "../Utils/Input";
import { Label } from "../Utils/Label";
import { RadioGroup, RadioGroupItem } from "../Utils/radio-group";
import { Lock, ShieldCheck, Shield, UserCog } from 'lucide-react';
import noImage from "../assets/noImage.jpg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

export default function AdminLogin() {
  const router = useRouter();
  const [adminType, setAdminType] = useState("head");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;
  
        // Store user credentials in localStorage
        localStorage.setItem("user", JSON.stringify({
          uid: user.uid,
          email: user.email,
          role: userRole,
        }));
  
        if (userRole === adminType) {
          router.push(`/${adminType}`);
        } else {
          alert("Access denied. Role mismatch. Please check your access level.");
        }
      } else {
        alert("Access denied. User role not found.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-2xl mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Image
            src={noImage}
            alt="Admin Portal Logo"
            width={80}
            height={80}
            className="mr-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">Administrative Portal</h1>
        </div>
        <p className="text-sm text-gray-600">Secure Admin Access - Authorized Personnel Only</p>
      </header>

      <Card className="w-full max-w-md border-t-4 border-blue-600 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            <div className="flex items-center justify-center gap-2">
              <UserCog className="w-6 h-6" />
              Admin Login
            </div>
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Access the administrative control panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminType" className="text-sm font-semibold text-gray-700">Admin Level</Label>
              <RadioGroup id="adminType" value={adminType} onValueChange={setAdminType} className="flex">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="head" id="super" />
                  <Label htmlFor="super" className="text-sm text-gray-600">Head</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lead" id="department" />
                  <Label htmlFor="department" className="text-sm text-gray-600">Team Lead</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="correspondant" id="moderator" />
                  <Label htmlFor="moderator" className="text-sm text-gray-600">Correspondant</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear" className="text-sm font-semibold text-gray-700">Academic Year</Label>
              <select 
                id="academicYear" 
                value={academicYear} 
                onChange={(e) => setAcademicYear(e.target.value)} 
                className="border-gray-300 bg-white text-black"
                required
              >
                <option value="" disabled>Select academic year</option>
                <option value="2023-24">2023-24</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              <Lock className="w-4 h-6 mr-2" />
              Access Admin Panel
            </Button>
          </form>

          <div className="mt-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                This is a restricted access portal. All login attempts are monitored and logged.
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 mr-1" />
              Protected by advanced security protocols
            </p>
          </div>
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Administrative Portal. All rights reserved.</p>
        <p className="mt-1">Secure Access Management System v2.0</p>
      </footer>
    </div>
  );
}
