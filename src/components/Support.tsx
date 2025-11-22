import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import { 
  MessageCircle, 
  Phone,
  Mail,
  Search,
  Send,
  ArrowLeft,
  HelpCircle,
  Clock,
  CheckCheck,
  Wrench,
  Package,
  CreditCard,
  MapPin
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'support';
  text: string;
  time: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved';
  date: string;
  category: string;
}

interface SupportProps {
  onBack: () => void;
}

const FAQ_ITEMS = [
  {
    category: 'Rentals',
    icon: Package,
    questions: [
      {
        q: 'How do I book a dirt bike rental?',
        a: 'Navigate to the Rentals section from the main menu, select your desired bike, choose your rental dates, and complete the booking process including document verification and payment.'
      },
      {
        q: 'What documents do I need to rent a bike?',
        a: 'You need a valid government-issued ID and a driver\'s license. These will be verified during the onboarding process.'
      },
      {
        q: 'What is the security deposit and when will it be refunded?',
        a: 'The security deposit is ₱10,000, which will be pre-authorized on your payment method. It will be automatically refunded within 5-7 business days after you return the bike in good condition.'
      },
      {
        q: 'Can I extend my rental period?',
        a: 'Yes, you can request an extension through the app. Contact support at least 24 hours before your original return date to check availability.'
      }
    ]
  },
  {
    category: 'Parts & Gear',
    icon: Wrench,
    questions: [
      {
        q: 'How do I check if a part is compatible with my bike?',
        a: 'Use the "My Garage" feature to save your bike\'s make, model, and year. When browsing parts, compatible items will be highlighted, and you can filter specifically for your bike.'
      },
      {
        q: 'What is your return policy?',
        a: 'Unused parts in original packaging can be returned within 30 days for a full refund. Installation services and used items are non-refundable.'
      },
      {
        q: 'Do you offer installation services?',
        a: 'Yes! Select parts can be installed at our shop. Check the product page for installation availability and pricing.'
      }
    ]
  },
  {
    category: 'Delivery',
    icon: MapPin,
    questions: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery within Metro Manila takes 1-2 business days. Provincial deliveries may take 3-5 business days. Same-day delivery is available for select areas.'
      },
      {
        q: 'Can I track my delivery?',
        a: 'Yes! Once your order is dispatched, you\'ll receive tracking information and can view real-time delivery status in the app.'
      },
      {
        q: 'What are the delivery fees?',
        a: 'Delivery fees start at ₱500 for Metro Manila and vary based on distance. The exact fee will be calculated during checkout based on your delivery address.'
      }
    ]
  },
  {
    category: 'Payment',
    icon: CreditCard,
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept GCash, PayMaya, credit/debit cards (Visa, Mastercard), and bank transfers.'
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes, all payment transactions are encrypted and processed through secure payment gateways. We never store your complete card details.'
      },
      {
        q: 'Can I get a refund?',
        a: 'Refunds are processed according to our return policy. Approved refunds are credited back to your original payment method within 7-14 business days.'
      }
    ]
  }
];

export function Support({ onBack }: SupportProps) {
  const [activeTab, setActiveTab] = useState<'faq' | 'chat' | 'ticket'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'support',
      text: 'Hello! How can I help you today?',
      time: '2:30 PM'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCategory, setTicketCategory] = useState('');

  const myTickets: Ticket[] = [
    {
      id: 'TCK-001',
      subject: 'Question about KTM 250 availability',
      status: 'resolved',
      date: '2 days ago',
      category: 'Rentals'
    },
    {
      id: 'TCK-002',
      subject: 'Delivery tracking not updating',
      status: 'in_progress',
      date: '1 day ago',
      category: 'Delivery'
    }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: newMessage,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate support response
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'support',
        text: 'Thank you for your message. A support specialist will assist you shortly.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, supportMessage]);
    }, 1000);
  };

  const handleSubmitTicket = () => {
    if (!ticketSubject || !ticketMessage || !ticketCategory) {
      toast.error('Please fill in all fields');
      return;
    }

    toast.success('Support ticket submitted successfully!', {
      description: 'We\'ll respond within 24 hours'
    });

    setTicketSubject('');
    setTicketMessage('');
    setTicketCategory('');
  };

  const filteredFAQs = FAQ_ITEMS.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pb-20">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-md flex items-center justify-center text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white">Support & Help</h1>
              <p className="text-sm text-slate-400">We're here to help you</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTab === 'faq'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <HelpCircle className="w-4 h-4 inline mr-2" />
              FAQ
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTab === 'chat'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Live Chat
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTab === 'ticket'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Tickets
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            {/* Search */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search for answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-900 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ Categories */}
            <div className="space-y-4">
              {filteredFAQs.map((category, idx) => (
                <Card key={idx} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <category.icon className="w-5 h-5 text-teal-400" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="space-y-2">
                      {category.questions.map((item, qIdx) => (
                        <AccordionItem
                          key={qIdx}
                          value={`item-${idx}-${qIdx}`}
                          className="bg-slate-900 rounded-lg border border-slate-700 px-4"
                        >
                          <AccordionTrigger className="text-white hover:no-underline">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-slate-300 text-sm">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Options */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Still need help?</CardTitle>
                <CardDescription className="text-slate-400">
                  Get in touch with our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white justify-start"
                  onClick={() => setActiveTab('chat')}
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Start Live Chat
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-white hover:bg-slate-700 justify-start"
                  onClick={() => toast.success('Calling support...')}
                >
                  <Phone className="w-5 h-5 mr-3" />
                  Call Support: (02) 8123-4567
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-white hover:bg-slate-700 justify-start"
                  onClick={() => setActiveTab('ticket')}
                >
                  <Mail className="w-5 h-5 mr-3" />
                  Submit a Ticket
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Support" />
                    <AvatarFallback>CS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-white text-base">Customer Support</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Online
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages */}
                <ScrollArea className="h-96 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.sender === 'user'
                              ? 'bg-teal-500 text-white'
                              : 'bg-slate-900 text-slate-300'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <p className="text-xs opacity-70">{message.time}</p>
                            {message.sender === 'user' && (
                              <CheckCheck className="w-3 h-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="border-t border-slate-700 p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-slate-900 border-slate-600 text-white"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Typical response time: 2-5 minutes
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => setNewMessage('I need help with my rental booking')}
                >
                  Help with rental booking
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => setNewMessage('Track my order')}
                >
                  Track my order
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => setNewMessage('Question about payment')}
                >
                  Question about payment
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Ticket Tab */}
        {activeTab === 'ticket' && (
          <div className="space-y-4">
            {/* My Tickets */}
            {myTickets.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">My Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {myTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-slate-900 rounded-lg p-4 border border-slate-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white text-sm">{ticket.subject}</span>
                            <Badge className={`${getStatusColor(ticket.status)} text-white border-none text-xs`}>
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400">
                            {ticket.category} • {ticket.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{ticket.date}</span>
                        <Button size="sm" variant="ghost" className="text-teal-400 hover:text-teal-300">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Submit New Ticket */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Submit New Ticket</CardTitle>
                <CardDescription className="text-slate-400">
                  We'll respond within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Rentals', 'Parts', 'Delivery', 'Payment'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setTicketCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          ticketCategory === cat
                            ? 'bg-teal-500 text-white'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Subject</Label>
                  <Input
                    placeholder="Brief description of your issue"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Message</Label>
                  <Textarea
                    placeholder="Provide details about your issue..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    rows={6}
                    className="bg-slate-900 border-slate-600 text-white resize-none"
                  />
                </div>

                <Button
                  onClick={handleSubmitTicket}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
