import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  FileText, 
  Search,
  Eye,
  Settings,
  UserPlus,
  Save,
  X
} from 'lucide-react'

const AdminPanel = ({ user, token }) => {
  const [activeTab, setActiveTab] = useState('usuarios')
  const [usuarios, setUsuarios] = useState([])
  const [ordens, setOrdens] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Estados para formulários
  const [showUserForm, setShowUserForm] = useState(false)
  const [showOSForm, setShowOSForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [editingOS, setEditingOS] = useState(null)
  
  const [userForm, setUserForm] = useState({
    nome: '',
    email: '',
    senha: '',
    cargo: '',
    nivel_acesso: 1
  })
  
  const [osForm, setOSForm] = useState({
    numero_os: '',
    tipo_os: 'Externa',
    descricao: '',
    details: '',
    workaround: '',
    data_source: '',
    url_imagem_capa: ''
  })

  const cargos = [
    'Comercial',
    'Dprog Gráfica',
    'Pré-impressão',
    'Supervisão de Impressão',
    'CTP',
    'Impressão Offset',
    'Impressão Digital',
    'Acabamento',
    'Expedição',
    'Administrador'
  ]

  useEffect(() => {
    if (activeTab === 'usuarios') {
      fetchUsuarios()
    } else if (activeTab === 'ordens') {
      fetchOrdens()
    }
  }, [activeTab])

  const fetchUsuarios = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUsuarios(data)
      }
    } catch (error) {
      setError('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  const fetchOrdens = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/ordens-servico', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setOrdens(data)
      }
    } catch (error) {
      setError('Erro ao carregar ordens de serviço')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userForm),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Usuário criado com sucesso!')
        setShowUserForm(false)
        setUserForm({ nome: '', email: '', senha: '', cargo: '', nivel_acesso: 1 })
        fetchUsuarios()
      } else {
        setError(data.message || 'Erro ao criar usuário')
      }
    } catch (err) {
      setError('Erro de conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOS = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:5000/api/ordens-servico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(osForm),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Ordem de Serviço criada com sucesso!')
        setShowOSForm(false)
        setOSForm({
          numero_os: '',
          tipo_os: 'Externa',
          descricao: '',
          details: '',
          workaround: '',
          data_source: '',
          url_imagem_capa: ''
        })
        fetchOrdens()
      } else {
        setError(data.message || 'Erro ao criar OS')
      }
    } catch (err) {
      setError('Erro de conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const renderUsuarios = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
          <p className="text-gray-600">Adicione, edite ou remova usuários do sistema</p>
        </div>
        <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo usuário do sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={userForm.nome}
                  onChange={(e) => setUserForm({...userForm, nome: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={userForm.senha}
                  onChange={(e) => setUserForm({...userForm, senha: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Select value={userForm.cargo} onValueChange={(value) => setUserForm({...userForm, cargo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargos.map((cargo) => (
                      <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nivel_acesso">Nível de Acesso</Label>
                <Select 
                  value={userForm.nivel_acesso.toString()} 
                  onValueChange={(value) => setUserForm({...userForm, nivel_acesso: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Básico</SelectItem>
                    <SelectItem value="2">2 - Supervisor</SelectItem>
                    <SelectItem value="3">3 - Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowUserForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Criando...' : 'Criar Usuário'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            {usuarios.length} usuário(s) cadastrado(s) no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usuarios.map((usuario) => (
              <div key={usuario.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{usuario.nome}</h4>
                    <p className="text-sm text-gray-600">{usuario.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{usuario.cargo}</Badge>
                  <Badge variant="secondary">Nível {usuario.nivel_acesso}</Badge>
                  <Badge variant={usuario.ativo ? "default" : "destructive"}>
                    {usuario.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderOrdens = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Ordens de Serviço</h2>
          <p className="text-gray-600">Visualize e gerencie todas as ordens de serviço</p>
        </div>
        <Dialog open={showOSForm} onOpenChange={setShowOSForm}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova OS
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Ordem de Serviço</DialogTitle>
              <DialogDescription>
                Preencha os dados da nova ordem de serviço.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateOS} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero_os">Número da OS</Label>
                  <Input
                    id="numero_os"
                    value={osForm.numero_os}
                    onChange={(e) => setOSForm({...osForm, numero_os: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo_os">Tipo da OS</Label>
                  <Select value={osForm.tipo_os} onValueChange={(value) => setOSForm({...osForm, tipo_os: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Externa">Externa</SelectItem>
                      <SelectItem value="Interna">Interna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={osForm.descricao}
                  onChange={(e) => setOSForm({...osForm, descricao: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details">Detalhes</Label>
                <Textarea
                  id="details"
                  value={osForm.details}
                  onChange={(e) => setOSForm({...osForm, details: e.target.value})}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url_imagem_capa">URL da Imagem de Capa</Label>
                <Input
                  id="url_imagem_capa"
                  type="url"
                  value={osForm.url_imagem_capa}
                  onChange={(e) => setOSForm({...osForm, url_imagem_capa: e.target.value})}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowOSForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Criando...' : 'Criar OS'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ordens de Serviço</CardTitle>
          <CardDescription>
            {ordens.length} ordem(ns) de serviço no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ordens.map((ordem) => (
              <div key={ordem.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{ordem.numero_os}</h4>
                    <p className="text-sm text-gray-600">{ordem.descricao || 'Sem descrição'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{ordem.tipo_os}</Badge>
                  <Badge variant="secondary">{ordem.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderRelatorios = () => (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios</h3>
      <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
    </div>
  )

  const renderConfiguracoes = () => (
    <div className="text-center py-12">
      <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Configurações do Sistema</h3>
      <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
    </div>
  )

  const adminTabs = [
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'ordens', label: 'Ordens de Serviço', icon: FileText },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'usuarios':
        return renderUsuarios()
      case 'ordens':
        return renderOrdens()
      case 'relatorios':
        return renderRelatorios()
      case 'configuracoes':
        return renderConfiguracoes()
      default:
        return renderUsuarios()
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {adminTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  )
}

export default AdminPanel

