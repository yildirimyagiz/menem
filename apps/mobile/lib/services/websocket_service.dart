import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../models/communication_log.dart';

class WebSocketService {
  WebSocketChannel? _channel;
  final _messageController = StreamController<CommunicationLog>.broadcast();
  final String _baseUrl;
  String? _authToken;

  WebSocketService(this._baseUrl);

  Stream<CommunicationLog> get messageStream => _messageController.stream;

  void setAuthToken(String token) {
    _authToken = token;
  }

  void connect() {
    if (_channel != null) return;

    final wsUrl = _baseUrl.replaceFirst('http', 'ws');
    _channel = WebSocketChannel.connect(
      Uri.parse('$wsUrl/ws?token=$_authToken'),
    );

    _channel!.stream.listen(
      (message) {
        try {
          final data = jsonDecode(message as String);
          final chatMessage = CommunicationLog.fromJson(data);
          _messageController.add(chatMessage);
        } catch (e) {
          // print('Error parsing WebSocket message: $e');
        }
      },
      onError: (error) {
        // print('WebSocket error: $error');
        _reconnect();
      },
      onDone: () {
        // print('WebSocket connection closed');
        _reconnect();
      },
    );
  }

  void _reconnect() {
    _channel?.sink.close();
    _channel = null;
    Future.delayed(const Duration(seconds: 5), connect);
  }

  void sendMessage(CommunicationLog message) {
    if (_channel == null) return;
    _channel!.sink.add(jsonEncode(message.toJson()));
  }

  void dispose() {
    _channel?.sink.close();
    _messageController.close();
  }
}
