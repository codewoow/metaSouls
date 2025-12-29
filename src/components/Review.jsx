import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Code,
  Play,
  BookOpen,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Share2,
  RotateCcw,
  Download,
  Copy,
  Check,
  Lightbulb,
} from 'lucide-react';

// 模拟题目数据
const sampleQuestions = {
  A: {
    title: '编程题 A：数字求和',
    description: `【题目描述】
给定两个整数 a 和 b，计算它们的和并输出。

【输入格式】
一行两个整数 a 和 b，用空格分隔（-1000 ≤ a, b ≤ 1000）

【输出格式】
输出一个整数，表示 a + b 的结果

【样例输入】
5 3

【样例输出】
8`,
    solution: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`,
    explanation: [
      '首先，我们需要包含输入输出流库 iostream',
      '使用命名空间 std 简化代码书写',
      '在 main 函数中，声明两个整型变量 a 和 b',
      '使用 cin 从标准输入读取两个整数',
      '使用 cout 输出 a + b 的结果',
      '返回 0 表示程序正常结束',
    ],
  },
  B: {
    title: '编程题 B：找最大值',
    description: `【题目描述】
给定三个整数，找出其中的最大值并输出。

【输入格式】
一行三个整数，用空格分隔（-1000 ≤ 每个数 ≤ 1000）

【输出格式】
输出一个整数，表示三个数中的最大值

【样例输入】
5 3 9

【样例输出】
9`,
    solution: `#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    int maxNum = a;
    if (b > maxNum) maxNum = b;
    if (c > maxNum) maxNum = c;
    cout << maxNum << endl;
    return 0;
}`,
    explanation: [
      '首先，我们需要包含输入输出流库 iostream',
      '声明三个整型变量 a、b、c 用于存储输入',
      '假设 a 是最大的，将 maxNum 初始化为 a',
      '使用 if 语句比较 b 和 maxNum，更新最大值',
      '同样地比较 c 和 maxNum',
      '输出最终的最大值 maxNum',
    ],
  },
};

// 举一反三题目
const practiceQuestion = {
  title: '练习题：找最小值',
  description: `【挑战任务】
给定三个整数，找出其中的最小值并输出。

【输入格式】
一行三个整数，用空格分隔

【输出格式】
输出三个数中的最小值

【样例输入】
5 3 9

【样例输出】
3`,
  hint: '提示：和找最大值的思路类似，不过这次要找最小的哦！',
  solution: `#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    int minNum = a;
    if (b < minNum) minNum = b;
    if (c < minNum) minNum = c;
    cout << minNum << endl;
    return 0;
}`,
};

const Review = ({ userData, onBack, onReviewOther }) => {
  const [step, setStep] = useState(0); // 0:回顾题目, 1:选择模式, 2:代码讲解, 3:举一反三, 4:完成报告
  const [mode, setMode] = useState(null); // 'retry' or 'viewAnswer'
  const [chatStep, setChatStep] = useState(0); // 代码讲解的对话步骤
  const [userCode, setUserCode] = useState('');
  const [codeResult, setCodeResult] = useState(null); // 'pass' or 'fail'
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const currentQuestion = sampleQuestions[userData.questionId];

  // 代码讲解对话脚本
  const codeDialogues = [
    `让我们来看看《${currentQuestion.title}》这道题的解法。`,
    `首先，理解题意：${userData.questionId === 'A' ? '我们需要读取两个整数并计算它们的和' : '我们需要找出三个数中的最大值'}`,
    '接下来，我将逐步讲解代码的实现...',
    ...currentQuestion.explanation,
    '看懂了吗？接下来让我们来做一道类似的题目验证一下！',
  ];

  // 打字机效果
  useEffect(() => {
    if (step === 2 && chatStep < codeDialogues.length) {
      const text = codeDialogues[chatStep];
      setDisplayedText('');
      setIsTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      let index = 0;
      const typeNextChar = () => {
        if (index < text.length) {
          setDisplayedText(text.substring(0, index + 1));
          index++;
          typingTimeoutRef.current = setTimeout(typeNextChar, 30);
        } else {
          setIsTyping(false);
          // 3秒后自动进入下一句（或者用户点击继续）
        }
      };

      typeNextChar();

      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }
  }, [chatStep, step]);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === 'viewAnswer') {
      setStep(2);
    } else {
      // 重做模式，暂时直接进入代码讲解
      setStep(2);
    }
  };

  const handleNextChat = () => {
    if (chatStep < codeDialogues.length - 1) {
      setChatStep(chatStep + 1);
    } else {
      setStep(3);
    }
  };

  const handleCodeSubmit = () => {
    // 简单验证：检查代码是否包含关键元素
    const hasInclude = userCode.includes('#include');
    const hasMain = userCode.includes('main');
    const hasCin = userCode.includes('cin');
    const hasCout = userCode.includes('cout');
    const hasMinLogic = userCode.includes('<') || userCode.includes('min');

    if (hasInclude && hasMain && hasCin && hasCout && hasMinLogic) {
      setCodeResult('pass');
    } else {
      setCodeResult('fail');
    }
  };

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Step 0: 题目回顾
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker p-4 md:p-8 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          {/* 顶部导航 */}
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-cyber-dark/50 border border-cyber-primary/30 rounded-lg hover:border-cyber-primary transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              返回
            </motion.button>
            <div className="text-cyber-primary font-bold">{userData.userName} - GESP {userData.level}级</div>
          </div>

          {/* 题目内容 */}
          <div className="glass-panel p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-8 h-8 text-cyber-primary" />
                <h1 className="text-3xl font-bold text-cyber-primary neon-text">{currentQuestion.title}</h1>
              </div>

              <div className="bg-cyber-dark/50 border-2 border-cyber-secondary/30 rounded-xl p-6 mb-6">
                <pre className="whitespace-pre-wrap text-gray-200 font-mono text-sm leading-relaxed">
                  {currentQuestion.description}
                </pre>
              </div>

              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(1)}
                  className="cyber-button bg-gradient-to-r from-cyber-primary to-cyber-secondary neon-text px-12"
                >
                  继续下一步 <ArrowRight className="w-5 h-5 inline ml-2" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Step 1: 选择模式
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker flex items-center justify-center p-4 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-3xl"
        >
          <div className="glass-panel p-8">
            {/* NPC 头像和对话 */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-secondary p-1 animate-float">
                <div className="w-full h-full rounded-full bg-cyber-dark flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-cyber-primary" />
                </div>
              </div>
              <div className="flex-1 bg-cyber-dark/50 border-2 border-cyber-primary/30 rounded-2xl rounded-tl-none p-6">
                <p className="text-lg">好，让我们开始复盘！你想自己重新做一遍，还是直接看答案讲解？</p>
              </div>
            </div>

            {/* 选项 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleModeSelect('retry')}
                className="cyber-button bg-cyber-dark/80 border-2 border-cyber-primary/50 hover:border-cyber-primary text-left p-6"
              >
                <Code className="w-8 h-8 text-cyber-primary mb-3" />
                <div className="text-xl font-bold mb-2">自己重做</div>
                <div className="text-sm text-gray-400">在代码编辑器中自己写一遍</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleModeSelect('viewAnswer')}
                className="cyber-button bg-gradient-to-r from-cyber-primary to-cyber-secondary text-left p-6"
              >
                <Lightbulb className="w-8 h-8 mb-3" />
                <div className="text-xl font-bold mb-2">直接看答案</div>
                <div className="text-sm opacity-80">查看详细讲解和标准答案</div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Step 2: 代码讲解（左右布局）
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker p-4 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto h-screen flex flex-col">
          {/* 顶部导航 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-cyber-primary font-bold">{currentQuestion.title}</span>
              <span className="text-gray-400">| 代码讲解</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i <= chatStep ? 'bg-cyber-primary' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 主内容区 - 左右布局 */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
            {/* 左边：聊天对话 */}
            <div className="glass-panel p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-secondary p-1">
                  <div className="w-full h-full rounded-full bg-cyber-dark flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-cyber-primary" />
                  </div>
                </div>
                <span className="font-bold text-cyber-primary">AI 助教</span>
              </div>

              {/* 对话内容 */}
              <div className="flex-1 overflow-y-auto">
                <div className="bg-cyber-dark/50 border-2 border-cyber-primary/30 rounded-2xl rounded-tl-none p-6 mb-4">
                  {displayedText && (
                    <p className="text-lg leading-relaxed">
                      {displayedText}
                      {isTyping && (
                        <span className="typewriter-cursor inline-block w-2 h-5 bg-cyber-primary ml-1 align-middle"></span>
                      )}
                    </p>
                  )}
                </div>

                {/* 历史对话 */}
                <div className="space-y-3">
                  {Array.from({ length: chatStep }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-cyber-dark/30 border border-cyber-primary/20 rounded-xl p-4"
                    >
                      <p className="text-gray-300">{codeDialogues[i]}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 继续按钮 */}
              {!isTyping && chatStep < codeDialogues.length && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextChat}
                  className="mt-4 cyber-button bg-gradient-to-r from-cyber-primary to-cyber-secondary"
                >
                  继续讲解 <ArrowRight className="w-5 h-5 inline ml-2" />
                </motion.button>
              )}
            </div>

            {/* 右边：代码区 */}
            <div className="glass-panel p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-cyber-primary" />
                  <span className="font-bold text-cyber-primary">标准答案</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(currentQuestion.solution);
                    handleShare();
                  }}
                  className="flex items-center gap-2 px-3 py-1 bg-cyber-dark/50 border border-cyber-primary/30 rounded-lg text-sm hover:border-cyber-primary"
                >
                  {copied ? <Check className="w-4 h-4 text-cyber-success" /> : <Copy className="w-4 h-4" />}
                  {copied ? '已复制' : '复制'}
                </motion.button>
              </div>

              {/* 代码展示 */}
              <div className="flex-1 bg-cyber-dark/70 border-2 border-cyber-secondary/30 rounded-xl overflow-hidden">
                <div className="bg-cyber-secondary/20 px-4 py-2 border-b border-cyber-secondary/30 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-sm text-gray-400">solution.cpp</span>
                </div>
                <pre className="p-4 overflow-auto h-full text-sm font-mono leading-relaxed">
                  <code className="text-gray-200">{currentQuestion.solution}</code>
                </pre>
              </div>

              {/* 代码说明 */}
              {chatStep >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-cyber-primary/10 border border-cyber-primary/30 rounded-lg"
                >
                  <p className="text-sm text-cyber-primary">
                    💡 这道题的关键点是：{userData.questionId === 'A' ? '使用 cin 读取输入，cout 输出结果' : '用 if 语句逐个比较，找出最大值'}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: 举一反三
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker p-4 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* 顶部 */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded-full mb-4"
            >
              <Trophy className="w-6 h-6" />
              <span className="font-bold text-lg">举一反三挑战</span>
            </motion.div>
            <p className="text-gray-400">完成下面这道题，验证你是否真正掌握了知识点</p>
          </div>

          {/* 题目和代码区 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左边：题目 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6"
            >
              <h3 className="text-xl font-bold text-cyber-primary mb-4">{practiceQuestion.title}</h3>
              <div className="bg-cyber-dark/50 border-2 border-cyber-secondary/30 rounded-xl p-4 mb-4">
                <pre className="whitespace-pre-wrap text-gray-200 text-sm leading-relaxed">
                  {practiceQuestion.description}
                </pre>
              </div>
              <div className="p-4 bg-cyber-warning/10 border border-cyber-warning/30 rounded-lg">
                <p className="text-sm text-cyber-warning">💡 {practiceQuestion.hint}</p>
              </div>
            </motion.div>

            {/* 右边：代码编辑器 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6"
            >
              <h3 className="text-xl font-bold text-cyber-primary mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                在这里写代码
              </h3>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder="#include &lt;iostream&gt;
using namespace std;

int main() {
    // 在这里写你的代码

    return 0;
}"
                className="w-full h-80 bg-cyber-dark/70 border-2 border-cyber-secondary/30 rounded-xl p-4 text-sm font-mono text-gray-200 focus:border-cyber-primary focus:outline-none resize-none"
              />

              {/* 结果反馈 */}
              <AnimatePresence>
                {codeResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-4 p-4 rounded-lg border-2 flex items-center gap-3 ${
                      codeResult === 'pass'
                        ? 'bg-cyber-success/10 border-cyber-success'
                        : 'bg-cyber-danger/10 border-cyber-danger'
                    }`}
                  >
                    {codeResult === 'pass' ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-cyber-success" />
                        <div>
                          <div className="font-bold text-cyber-success">太棒了！代码通过了！</div>
                          <div className="text-sm text-gray-400">你已经掌握了这个知识点</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-cyber-danger" />
                        <div>
                          <div className="font-bold text-cyber-danger">代码还有问题</div>
                          <div className="text-sm text-gray-400">检查一下是否包含了必要的逻辑</div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 提交按钮 */}
              <div className="mt-4 flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCodeSubmit}
                  disabled={!userCode.trim()}
                  className="flex-1 cyber-button bg-gradient-to-r from-cyber-primary to-cyber-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  提交验证
                </motion.button>
                {codeResult === 'pass' && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(4)}
                    className="cyber-button bg-gradient-to-r from-cyber-success to-green-600"
                  >
                    查看复盘报告 <Trophy className="w-5 h-5 inline ml-2" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: 复盘完成报告
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker flex items-center justify-center p-4 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-3xl"
        >
          <div className="glass-panel p-8">
            {/* 成功标志 */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 mx-auto bg-gradient-to-br from-cyber-success to-green-600 rounded-full flex items-center justify-center mb-4"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-cyber-success neon-text mb-2">复盘完成！</h1>
              <p className="text-gray-400">恭喜你，已经完成了这道题的深度学习</p>
            </div>

            {/* 复盘报告卡片 */}
            <div className="bg-cyber-dark/50 border-2 border-cyber-primary/30 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-cyber-primary mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                复盘报告
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">学员姓名</div>
                    <div className="text-lg font-bold">{userData.userName}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">考试等级</div>
                    <div className="text-lg font-bold text-cyber-primary">GESP {userData.level}级</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">复盘题目</div>
                    <div className="text-lg font-bold">编程题 {userData.questionId}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">原始得分</div>
                    <div className="text-lg font-bold">
                      {userData.score === 25 ? (
                        <span className="text-cyber-success">{userData.score} 分 🟢</span>
                      ) : userData.score === 12.5 ? (
                        <span className="text-cyber-warning">{userData.score} 分 🟡</span>
                      ) : (
                        <span className="text-cyber-danger">{userData.score} 分 🔴</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-cyber-primary/20">
                  <div className="text-gray-400 text-sm mb-2">学习总结</div>
                  <div className="text-gray-200">
                    {userData.score === 25
                      ? '已经掌握基础知识，通过复盘学习了更优的解题思路。'
                      : userData.score === 12.5
                      ? '发现了知识薄弱点，通过讲解找到了问题所在。'
                      : '从零开始学习了完整的解题思路和方法。'}
                    举一反三练习已通过验证，知识点掌握良好！
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="cyber-button bg-gradient-to-r from-cyber-primary to-cyber-secondary"
              >
                {copied ? <Check className="w-5 h-5 inline mr-2" /> : <Copy className="w-5 h-5 inline mr-2" />}
                {copied ? '已复制报告' : '复制报告分享'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onReviewOther}
                className="cyber-button bg-cyber-dark/80 border-2 border-cyber-primary/50 hover:border-cyber-primary"
              >
                <RotateCcw className="w-5 h-5 inline mr-2" />
                复盘其他题目
              </motion.button>
            </div>

            {/* 分享提示 */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>将报告分享给家长，展示你的学习成果！</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default Review;
