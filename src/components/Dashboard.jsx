import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import AdminPanel from './AdminPanel'
import { 
  LayoutDashboard, 
  Kanban, 
  Calendar, 
  CheckSquare, 
  FileText, 
  Settings, 
  LogOut,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Clock,
  User,
  Building,
  Shield
} from 'lucide-react'

const Dashboard = ({ user, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('resumo')
  const [ordens, setOrdens] = useState([])
  const [kanbanData, setKanbanData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrdens()
    fetchKanbanData()
  }, [])

  const fetchOrdens = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ordens-servico', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      console.log(response.json)

      if (response.ok) {
        const data = await response.json()
        setOrdens(data)
      }
    } catch (error) {
      console.error('Erro ao buscar ordens:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchKanbanData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/kanban', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setKanbanData(data)
      }
    } catch (error) {
      console.error('Erro ao buscar dados do kanban:', error)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'OS Criada': 'bg-blue-100 text-blue-800',
      'Dprog Gráfica': 'bg-purple-100 text-purple-800',
      'Triagem': 'bg-yellow-100 text-yellow-800',
      'Supervisão de Impressão': 'bg-orange-100 text-orange-800',
      'CTP': 'bg-indigo-100 text-indigo-800',
      'Impressão Offset': 'bg-pink-100 text-pink-800',
      'Impressão Digital': 'bg-cyan-100 text-cyan-800',
      'Acabamento': 'bg-green-100 text-green-800',
      'Expedição': 'bg-red-100 text-red-800',
      'Cliente (Entrega Final)': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const menuItems = [
    { id: 'resumo', label: 'Resumo', icon: LayoutDashboard },
    { id: 'quadro', label: 'Quadro', icon: Kanban },
    { id: 'calendario', label: 'Calendário', icon: Calendar },
    { id: 'aprovacoes', label: 'Aprovações', icon: CheckSquare },
    { id: 'formularios', label: 'Formulários', icon: FileText },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ]

  // Adicionar painel administrativo se o usuário for admin
  if (user.nivel_acesso >= 3) {
    menuItems.push({ id: 'admin', label: 'Painel Admin', icon: Shield })
  }

  const renderResumo = () => (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de OS</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordens.length}</div>
            <p className="text-xs text-muted-foreground">
              Ordens de serviço ativas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ordens.filter(o => o.status !== 'Cliente (Entrega Final)').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando processamento
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ordens.filter(o => o.status === 'Cliente (Entrega Final)').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Entregues ao cliente
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meu Cargo</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{user.cargo}</div>
            <p className="text-xs text-muted-foreground">
              Nível de acesso: {user.nivel_acesso}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ordens Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Ordens de Serviço Recentes</CardTitle>
          <CardDescription>
            Últimas ordens criadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ordens.slice(0, 5).map((ordem) => (
              <div key={ordem.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{ordem.numero_os}</h4>
                    <p className="text-sm text-gray-600">{ordem.descricao || 'Sem descrição'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(ordem.status)}>
                    {ordem.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(ordem.data_inicio).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderQuadro = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quadro Gestão Gráfica</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          {(user.cargo === 'Comercial' || user.nivel_acesso >= 3) && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova OS
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto">
        {Object.entries(kanbanData).map(([status, items]) => (
          <Card key={status} className="min-w-[280px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{status}</CardTitle>
                <Badge variant="secondary">{items.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <Card key={item.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{item.numero_os}</h4>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                    {item.url_imagem_capa && (
                      <div className="w-full h-20 bg-gray-100 rounded border"></div>
                    )}
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {item.descricao || 'Sem descrição'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{item.tipo_os}</span>
                      <span>{new Date(item.data_inicio).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'resumo':
        return renderResumo()
      case 'quadro':
        return renderQuadro()
      case 'admin':
        return <AdminPanel user={user} token={token} />
      case 'calendario':
        return (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Calendário</h3>
            <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
          </div>
        )
      case 'aprovacoes':
        return (
          <div className="text-center py-12">
            <CheckSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aprovações</h3>
            <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
          </div>
        )
      case 'formularios':
        return (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Formulários</h3>
            <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
          </div>
        )
      case 'configuracoes':
        return (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Configurações</h3>
            <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
          </div>
        )
      default:
        return renderResumo()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 text-white px-3 py-2 rounded-lg font-bold">
                CEPE
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Sistema de Gestão</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback className="bg-green-100 text-green-700">
                    {user.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{user.nome}</p>
                  <p className="text-gray-600">{user.cargo}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === item.id 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard

