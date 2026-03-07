import Card from '@/components/UI/Card';
import Badge from '@/components/UI/Badge';

export default function AboutPage() {
  const features = [
    { icon: '🧠', title: 'AI Explanations', desc: 'Medical info in simple language' },
    { icon: '🛡️', title: 'Interaction Checker', desc: 'Check medication safety' },
    { icon: '🔔', title: 'Smart Reminders', desc: 'Never miss a dose' },
    { icon: '👥', title: 'Caregiver Support', desc: 'Keep family informed' },
    { icon: '📊', title: 'Analytics', desc: 'Track your progress' },
    { icon: '❤️', title: 'Missed Dose Help', desc: 'Clear instructions' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-6 text-4xl">❤️</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          About <span className="text-indigo-600">Mediora AI</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          AI-assisted medication safety platform for patients and caregivers.
        </p>
        <div className="flex justify-center gap-2 mt-6">
          <Badge variant="primary">Healthcare AI</Badge>
          <Badge variant="success">Patient Safety</Badge>
          <Badge variant="info">Medication Management</Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-red-50 border-2 border-red-100">
          <div className="flex gap-4">
            <span className="text-3xl">😟</span>
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-3">The Problem</h3>
              <ul className="space-y-2 text-red-700">
                <li>• Complex medication instructions</li>
                <li>• Drug interactions go unnoticed</li>
                <li>• Poor medication adherence</li>
                <li>• Caregivers lack visibility</li>
              </ul>
            </div>
          </div>
        </Card>
        <Card className="bg-green-50 border-2 border-green-100">
          <div className="flex gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-3">Our Solution</h3>
              <ul className="space-y-2 text-green-700">
                <li>✓ AI explains in simple language</li>
                <li>✓ Automatic interaction detection</li>
                <li>✓ Smart reminders</li>
                <li>✓ Real-time caregiver monitoring</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <Card key={i}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-12">
        <span className="text-4xl">⭐</span>
        <h2 className="text-2xl font-bold mt-4 mb-2">Our Vision</h2>
        <p className="text-xl italic text-white/90">"Making medication management safer, simpler, and smarter."</p>
      </Card>

      <Card className="text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">PS</div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">Created by Piyush Salve</h3>
        <p className="text-gray-500">Pharmacy Student & Developer</p>
      </Card>

      <Card className="bg-yellow-50 border-2 border-yellow-200">
        <div className="flex gap-4">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">Disclaimer</h3>
            <p className="text-yellow-700 text-sm">Information provided is for educational purposes only. Always consult your healthcare provider.</p>
          </div>
        </div>
      </Card>

      <div className="text-center py-8 border-t">
        <p className="text-gray-500">© 2024 Mediora AI. Created with ❤️ by <strong>Piyush Salve</strong></p>
      </div>
    </div>
  );
}