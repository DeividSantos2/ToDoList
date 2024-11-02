import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';

type Tarefa = {
  id: number;
  texto: string;
  concluida: boolean;
  removidaEm?: Date;
};

export default function App() {
  const [tarefa, setTarefa] = useState('');
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [tarefasRemovidas, setTarefasRemovidas] = useState<Tarefa[]>([]);
  const [editarTarefaId, setEditarTarefaId] = useState<number | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);

  const adicionarTarefa = () => {
    if (tarefa.trim()) {
      setTarefas([...tarefas, { id: Date.now(), texto: tarefa, concluida: false }]);
      setTarefa('');
    }
  };

  const concluirTarefa = (id: number) => {
    const novasTarefas = tarefas.map((tarefa) =>
      tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
    );
    setTarefas(novasTarefas);
  };

  const removerTarefa = (id: number) => {
    const tarefaRemover = tarefas.find((tarefa) => tarefa.id === id);
    if (tarefaRemover) {
      setTarefasRemovidas([...tarefasRemovidas, { ...tarefaRemover, removidaEm: new Date() }]);
      const tarefasFiltradas = tarefas.filter((tarefa) => tarefa.id !== id);
      setTarefas(tarefasFiltradas);
    }
  };

  const restaurarTarefa = (id: number) => {
    const tarefaRestaurar = tarefasRemovidas.find((tarefa) => tarefa.id === id);
    if (tarefaRestaurar) {
      setTarefas([...tarefas, { ...tarefaRestaurar, removidaEm: undefined }]);
      const tarefasRemovidasAtualizadas = tarefasRemovidas.filter((tarefa) => tarefa.id !== id);
      setTarefasRemovidas(tarefasRemovidasAtualizadas);
    }
  };

  const removerTarefaDefinitivamente = (id: number) => {
    const tarefasRemovidasAtualizadas = tarefasRemovidas.filter((tarefa) => tarefa.id !== id);
    setTarefasRemovidas(tarefasRemovidasAtualizadas);
  };

  const editarTarefa = (id: number, texto: string) => {
    setEditarTarefaId(id);
    setTarefa(texto);
  };

  const salvarTarefa = () => {
    if (tarefa.trim() && editarTarefaId !== null) {
      const tarefasAtualizadas = tarefas.map((t) =>
        t.id === editarTarefaId ? { ...t, texto: tarefa } : t
      );
      setTarefas(tarefasAtualizadas);
      setEditarTarefaId(null);
      setTarefa('');
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Lista de Tarefas</Text>
      <View style={estilos.inputContainer}>
        <TextInput
          style={estilos.input}
          placeholder="Nova tarefa..."
          value={tarefa}
          onChangeText={setTarefa}
        />
        <TouchableOpacity onPress={editarTarefaId ? salvarTarefa : adicionarTarefa} style={estilos.botaoAdicionar}>
          <Text style={estilos.botaoAdicionarTexto}>{editarTarefaId ? 'Salvar' : 'Adicionar'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={estilos.tarefaContainer}>
            <TouchableOpacity onPress={() => concluirTarefa(item.id)} style={estilos.tarefaTextoContainer}>
              <Text
                style={[
                  estilos.tarefaTexto,
                  { textDecorationLine: item.concluida ? 'line-through' : 'none', color: item.concluida ? 'gray' : 'black' }
                ]}
              >
                {item.texto}
              </Text>
            </TouchableOpacity>
            <View style={estilos.botaoContainer}>
              <TouchableOpacity onPress={() => editarTarefa(item.id, item.texto)} style={estilos.botaoEditar}>
                <Text style={estilos.botaoEditarTexto}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removerTarefa(item.id)} style={estilos.botaoRemover}>
                <Text style={estilos.botaoRemoverTexto}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={estilos.textoVazio}>Nenhuma tarefa adicionada</Text>}
      />

      {/* Botão para abrir o modal */}
      <TouchableOpacity onPress={() => setModalVisivel(true)} style={estilos.botaoHistorico}>
        <Text style={estilos.botaoHistoricoTexto}>Ver Histórico</Text>
      </TouchableOpacity>

      {/* Modal do histórico */}
      <Modal visible={modalVisivel} animationType="slide" transparent={true} onRequestClose={() => setModalVisivel(false)}>
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalContent}>
            <Text style={estilos.modalTitulo}>Histórico de Tarefas Removidas</Text>
            <FlatList
              data={tarefasRemovidas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={estilos.historicoItemContainer}>
                  <View style={estilos.historicoItem}>
                    <Text style={estilos.historicoTexto}>{item.texto}</Text>
                    <Text style={estilos.historicoData}>
                      Removida em: {item.removidaEm?.toLocaleDateString()} às {item.removidaEm?.toLocaleTimeString()}
                    </Text>
                    <View style={estilos.historicoBotaoContainer}>
                      <TouchableOpacity onPress={() => restaurarTarefa(item.id)} style={estilos.botaoRestaurar}>
                        <Text style={estilos.botaoRestaurarTexto}>Restaurar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removerTarefaDefinitivamente(item.id)} style={estilos.botaoRemoverDefinitivamente}>
                        <Text style={estilos.botaoRemoverDefinitivamenteTexto}>Remover Definitivamente</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={estilos.textoVazio}>Nenhuma tarefa removida</Text>}
            />
            <TouchableOpacity onPress={() => setModalVisivel(false)} style={estilos.botaoFechar}>
              <Text style={estilos.botaoFecharTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  botaoAdicionar: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
  },
  botaoAdicionarTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  tarefaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tarefaTextoContainer: {
    flex: 1,
  },
  tarefaTexto: {
    fontSize: 16,
  },
  botaoContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  botaoEditar: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  botaoEditarTexto: {
    color: 'white',
    fontSize: 14,
  },
  botaoRemover: {
    backgroundColor: '#dc3545',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  botaoRemoverTexto: {
    color: 'white',
    fontSize: 14,
  },
  textoVazio: {
    textAlign: 'center',
    color: '#aaa',
    fontStyle: 'italic',
  },
  botaoHistorico: {
      backgroundColor: '#6c757d',
      padding: 10,
      borderRadius: 5,
      alignSelf: 'center',
      marginTop: 20,
    },
    botaoHistoricoTexto: {
      color: 'white',
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    modalTitulo: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    historicoItemContainer: {
      marginBottom: 10,
    },
    historicoItem: {
      backgroundColor: '#f8f9fa',
      borderRadius: 5,
      padding: 10,
      borderColor: '#ddd',
      borderWidth: 1,
    },
    historicoTexto: {
      fontSize: 16,
    },
    historicoData: {
      fontSize: 12,
      color: 'gray',
    },
    historicoBotaoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 5,
    },
    botaoRestaurar: {
      backgroundColor: '#28a745',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    botaoRestaurarTexto: {
      color: 'white',
      fontSize: 14,
    },
    botaoRemoverDefinitivamente: {
      backgroundColor: '#dc3545',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    botaoRemoverDefinitivamenteTexto: {
      color: 'white',
      fontSize: 14,
    },
    botaoFechar: {
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      alignSelf: 'center',
    },
    botaoFecharTexto: {
      color: 'white',
      fontWeight: 'bold',
    },
  });


