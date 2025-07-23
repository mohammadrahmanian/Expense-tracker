import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  TrendingUp,
  PieChart,
  Shield,
  Smartphone,
  BarChart3,
  Wallet,
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">$</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Expensio
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Take control of your finances with our comprehensive income and
              expense tracking application. Visualize your spending patterns,
              set budgets, and achieve your financial goals.
            </p>

            <div className="flex justify-center space-x-4">
              <Link to="/register">
                <Button size="lg" className="px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Track Everything</CardTitle>
                <CardDescription>
                  Record all your income and expenses with detailed
                  categorization and recurring transaction support.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Visual Analytics</CardTitle>
                <CardDescription>
                  Beautiful charts and graphs to understand your spending
                  patterns and financial trends over time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Budget Planning</CardTitle>
                <CardDescription>
                  Set spending goals, track your progress, and get insights on
                  how to improve your savings rate.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Additional Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle>Smart Categorization</CardTitle>
                </div>
                <CardDescription>
                  Organize your transactions with customizable categories. Each
                  category can have its own color and budget allocation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle>Secure & Private</CardTitle>
                </div>
                <CardDescription>
                  Your financial data is protected with industry-standard
                  security. Each user's data is completely isolated and secure.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already started their journey to
              financial freedom. Sign up today and get started with tracking
              your expenses in minutes.
            </p>
            <Link to="/register">
              <Button size="lg" className="px-12 py-3 text-lg">
                Start Your Financial Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
