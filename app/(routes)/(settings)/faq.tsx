import AppScreen from '@/components/ui/AppScreen'
import {router} from 'expo-router'
import {ChevronDown, ChevronLeft, ChevronUp} from 'lucide-react-native'
import React, {useState} from 'react'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'

// 1. FAQ Data Array
const faqData = [
  {
    id: 1,
    question: 'What is Risus?',
    answer:
      'Risus is a platform designed to provide seamless experiences for our users through innovative features.'
  },
  {
    id: 2,
    question: 'How does Risus work?',
    answer:
      'Risus works by connecting you with various services directly through our intuitive mobile interface.'
  },
  {
    id: 3,
    question: 'How do I reset my password?',
    answer:
      "You can reset your password by going to the Profile settings and clicking on 'Security' then 'Reset Password'."
  },
  {
    id: 4,
    question: 'How do rewards work?',
    answer:
      'You earn reward points for every activity you complete, which can be redeemed for exclusive benefits.'
  },
  {
    id: 5,
    question: 'The app is not working properly. What should I do?',
    answer:
      'Try clearing your app cache or restarting the application. If the issue persists, contact support.'
  }
]

const FAQScreen = () => {
  // State to track which item is expanded
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleAccordion = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <AppScreen isEnableLinearGradient animateOnFocus >
      {/* Header Section */}
      <View className="pt-3 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mb-8">
          <ChevronLeft color="#1e293b" size={28} strokeWidth={2.5} />
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-[#1e293b] leading-tight mb-8">
          Frequently Asked Questions
        </Text>
      </View>

      {/* FAQ List */}
      <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
        {faqData.map((item) => {
          const isExpanded = expandedId === item.id

          return (
            <View key={item.id} className="mb-8">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => toggleAccordion(item.id)}
                className="flex-row items-center justify-between"
              >
                <Text className="flex-1 text-[18px] font-bold text-[#1e293b] mr-4">
                  {item.question}
                </Text>
                {isExpanded ? (
                  <ChevronUp color="#1e293b" size={24} strokeWidth={2.5} />
                ) : (
                  <ChevronDown color="#1e293b" size={24} strokeWidth={2.5} />
                )}
              </TouchableOpacity>

              {/* Collapsible Answer */}
              {isExpanded && (
                <View className="mt-4">
                  <Text className="text-gray-600 text-base leading-6">
                    {item.answer}
                  </Text>
                </View>
              )}
            </View>
          )
        })}
      </ScrollView>
    </AppScreen>
  )
}

export default FAQScreen
