import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { symptoms } = await request.json();

    if (!symptoms) {
      return NextResponse.json({ error: 'Symptoms required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a medical triage AI assistant. Analyze the following symptoms and provide:
1. List of possible conditions (3-5)
2. Risk level (low, medium, high)
3. Urgency score (0-100)
4. Recommendations (3-5 specific recommendations)

Symptoms: ${symptoms}

Respond in JSON format:
{
  "conditions": ["condition1", "condition2"],
  "riskLevel": "low|medium|high",
  "urgency": 50,
  "recommendations": ["recommendation1", "recommendation2"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    return NextResponse.json(
      { error: 'Failed to analyze symptoms' },
      { status: 500 }
    );
  }
}
